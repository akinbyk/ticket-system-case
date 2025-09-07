// src/api/mock.js
import MockAdapter from "axios-mock-adapter";
import { api } from "./axios";


const STORAGE_KEY = "ticket_mock_db_v1";

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
 
  return {
    
    users: [
      { id: 1, username: "admin", name: "Yönetici", role: "admin", password: "123456", avatar: "https://i.pravatar.cc/100?img=12" },
      { id: 2, username: "ali",   name: "Ali Kullanıcı", role: "user",  password: "1234"  },
    ],
    requests: [
      {
        id: 1,
        code: "2025-CS001",
        title: "Nasıl para yatırırım?",
        description: "Portala para yatırmada hata alıyorum.",
        status: "Açık",
        priority: "high",
        createdAt: "2025-09-04T10:00:00.000Z",
        userId: 1
      },
      {
        id: 2,
        code: "2025-CS002",
        title: "Şifre sıfırlama e-postası gelmiyor",
        description: "Spam'e de baktım, gelmedi.",
        status: "Çözülüyor",
        priority: "medium",
        createdAt: "2025-09-03T09:30:00.000Z",
        userId: 2
      }
    ],
    comments: [
      {
        id: 1,
        requestId: 1,
        authorId: 1,
        authorName: "Yönetici",
        text: "Destek kaydınız alınmıştır.",
        createdAt: "2025-09-04T11:00:00.000Z"
      }
    ]
  };
}

function saveDB(db) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch {}
}

// Yardımcılar
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const genId = () => Date.now(); // yeterli
const genCode = () => {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REQ-${s}`;
};

export function initMockApi({ responseDelay = 300 } = {}) {
  const mock = new MockAdapter(api, { delayResponse: responseDelay });
  let db = loadDB();

  // ---------- USERS ----------

  mock.onGet(/\/users$/).reply(async (config) => {
    await delay(100);
    const { username } = config.params || {};
    let data = db.users;
    if (username) data = data.filter((u) => u.username === username);
    return [200, data];
  });

  // ---------- REQUESTS ----------

  mock.onGet(/\/requests$/).reply(async (config) => {
    await delay(120);
    const params = config.params || {};
    let data = [...db.requests];
    if (params._sort === "createdAt") {
      data.sort((a, b) =>
        (params._order || "asc") === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    return [200, data];
  });

  // GET /requests/:id
  mock.onGet(/\/requests\/\d+$/).reply(async (config) => {
    await delay(100);
    const id = Number(config.url.match(/\/requests\/(\d+)$/)[1]);
    const item = db.requests.find((r) => r.id === id);
    if (!item) return [404, { message: "Not found" }];
    return [200, item];
  });

  // POST /requests
  mock.onPost(/\/requests$/).reply(async (config) => {
    await delay(150);
    const body = JSON.parse(config.data || "{}");
    const item = {
      id: body.id || genId(),
      code: body.code || genCode(),
      createdAt: body.createdAt || new Date().toISOString(),
      status: body.status || "Açık",
      title: body.title || "",
      description: body.description || "",
      priority: body.priority || "low",
      userId: body.userId,
    };
    db.requests.unshift(item);
    saveDB(db);
    return [201, item];
  });

  // PATCH /requests/:id
  mock.onPatch(/\/requests\/\d+$/).reply(async (config) => {
    await delay(150);
    const id = Number(config.url.match(/\/requests\/(\d+)$/)[1]);
    const patch = JSON.parse(config.data || "{}");
    const idx = db.requests.findIndex((r) => r.id === id);
    if (idx === -1) return [404, { message: "Not found" }];
    db.requests[idx] = { ...db.requests[idx], ...patch };
    const updated = db.requests[idx];
    saveDB(db);
    return [200, updated];
  });

  // ---------- COMMENTS ----------
  // GET /comments?requestId=1&_sort=createdAt&_order=asc
  mock.onGet(/\/comments$/).reply(async (config) => {
    await delay(80);
    const params = config.params || {};
    let data = db.comments;
    if (params.requestId) {
      data = data.filter((c) => String(c.requestId) === String(params.requestId));
    }
    if (params._sort === "createdAt") {
      data.sort((a, b) =>
        (params._order || "asc") === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    return [200, data];
  });

  // POST /comments
  mock.onPost(/\/comments$/).reply(async (config) => {
    await delay(120);
    const body = JSON.parse(config.data || "{}");
    const item = {
      id: genId(),
      requestId: body.requestId,
      authorId: body.authorId,
      authorName: body.authorName,
      text: body.text || "",
      createdAt: new Date().toISOString(),
    };
    db.comments.push(item);
    saveDB(db);
    return [201, item];
  });



  mock.onDelete(/\/requests\/\d+$/).reply(async (config) => {
  const id = Number(config.url.match(/\/requests\/(\d+)$/)[1]);
  const idx = db.requests.findIndex((r) => r.id === id);
  if (idx === -1) return [404, { message: "Not found" }];
  db.requests.splice(idx, 1);
  db.comments = db.comments.filter((c) => String(c.requestId) !== String(id));
  saveDB(db);
  return [204];
});


  mock.onAny().reply(async () => {
    await delay(50);
    return [404, { message: "Mocked: endpoint not found" }];
  });

 
  return {
    reset: () => {
      db = loadDB();
    },
    clearAll: () => {
      db = loadDB(); 
      saveDB(db);
    },
    get db() {
      return db;
    }
  };
}
