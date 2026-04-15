// src/api/mock.js
// Mock API for SoulSync AI — mirrors http://localhost:8000
// Swap this file with a real axios-based api.js when backend is ready.

const delay = (ms = 1000) => new Promise((res) => setTimeout(res, ms));

// ─── Seeded mock data ────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: "user_001",
    email: "priya@example.com",
    role: "user",
    basic_info: {
      full_name: "Priya Sharma",
      age: 26,
      gender: "Female",
      city: "Mumbai",
      state: "Maharashtra",
      religion: "Hindu",
      mother_tongue: "Hindi",
      height: "5'4\"",
      phone: "+919876543210",
    },
    professional_info: {
      education: "B.Tech",
      occupation: "Software Engineer",
      annual_income: "10L+",
      company: "Infosys",
    },
    ai_profile: {
      bio: "A passionate engineer who loves hiking, cooking, and reading sci-fi. Looking for someone genuine and adventurous to share life's journey.",
      interests: ["hiking", "cooking", "reading", "travel"],
      relationship_goal: "long-term",
    },
    astrology: {
      sun_sign: "Pisces",
      moon_sign: "Scorpio",
      reading:
        "You are deeply intuitive and empathetic. Your emotional intelligence is your greatest strength. You seek a partner who values depth and authenticity.",
      dob: "1998-03-15",
      time: "08:30",
      place: "Mumbai, India",
    },
    partner_preferences: {
      age_range: [25, 32],
      preferred_cities: ["Mumbai", "Pune", "Bangalore"],
      religion_preference: "Any",
    },
    verification: { status: "verified" },
    profile_photo: "https://i.pravatar.cc/300?img=47",
    compatibility: 87,
    profile_views: 127,
    created_at: "2025-11-01T10:00:00Z",
    last_active: "2026-04-15T08:00:00Z",
  },
  {
    id: "user_002",
    email: "arjun@example.com",
    role: "user",
    basic_info: {
      full_name: "Arjun Mehta",
      age: 29,
      gender: "Male",
      city: "Delhi",
      state: "Delhi",
      religion: "Hindu",
      mother_tongue: "Hindi",
      height: "5'11\"",
      phone: "+919876543211",
    },
    professional_info: {
      education: "MBA",
      occupation: "Product Manager",
      annual_income: "10L+",
      company: "Flipkart",
    },
    ai_profile: {
      bio: "Avid traveller and weekend chef. Believes in meaningful conversations over small talk. Looking for a partner who shares a love for exploration.",
      interests: ["travel", "cooking", "photography", "chess"],
      relationship_goal: "long-term",
    },
    astrology: {
      sun_sign: "Capricorn",
      moon_sign: "Taurus",
      reading:
        "Disciplined and grounded, you build what lasts. You value loyalty and stability above all, and seek a partner who complements your ambition.",
      dob: "1996-01-05",
      time: "14:15",
      place: "Delhi, India",
    },
    partner_preferences: {
      age_range: [24, 30],
      preferred_cities: ["Delhi", "Mumbai", "Gurgaon"],
      religion_preference: "Hindu",
    },
    verification: { status: "verified" },
    profile_photo: "https://i.pravatar.cc/300?img=12",
    compatibility: 92,
    profile_views: 204,
    created_at: "2025-10-20T09:00:00Z",
    last_active: "2026-04-14T20:00:00Z",
  },
  {
    id: "user_003",
    email: "sneha@example.com",
    role: "user",
    basic_info: {
      full_name: "Sneha Iyer",
      age: 27,
      gender: "Female",
      city: "Bangalore",
      state: "Karnataka",
      religion: "Hindu",
      mother_tongue: "Tamil",
      height: "5'3\"",
      phone: "+919876543212",
    },
    professional_info: {
      education: "M.Tech",
      occupation: "Data Scientist",
      annual_income: "10L+",
      company: "Amazon",
    },
    ai_profile: {
      bio: "Data nerd by day, classical dancer by evening. I find beauty in patterns — in data and in life. Seeking someone intellectually curious.",
      interests: ["dance", "data science", "yoga", "movies"],
      relationship_goal: "long-term",
    },
    astrology: {
      sun_sign: "Virgo",
      moon_sign: "Cancer",
      reading:
        "Analytical yet deeply caring, you balance logic with intuition beautifully. You are drawn to partners who are both intellectually stimulating and emotionally present.",
      dob: "1998-09-10",
      time: "06:45",
      place: "Chennai, India",
    },
    partner_preferences: {
      age_range: [27, 34],
      preferred_cities: ["Bangalore", "Chennai", "Hyderabad"],
      religion_preference: "Any",
    },
    verification: { status: "pending" },
    profile_photo: "https://i.pravatar.cc/300?img=5",
    compatibility: 74,
    profile_views: 89,
    created_at: "2025-12-05T11:00:00Z",
    last_active: "2026-04-13T15:00:00Z",
  },
  {
    id: "user_004",
    email: "rahul@example.com",
    role: "user",
    basic_info: {
      full_name: "Rahul Verma",
      age: 31,
      gender: "Male",
      city: "Pune",
      state: "Maharashtra",
      religion: "Hindu",
      mother_tongue: "Marathi",
      height: "6'0\"",
      phone: "+919876543213",
    },
    professional_info: {
      education: "MBBS",
      occupation: "Doctor",
      annual_income: "10L+",
      company: "Fortis Hospital",
    },
    ai_profile: {
      bio: "Healing people is my calling; music is my escape. A doctor who loves jazz and long drives. I value kindness and shared silences.",
      interests: ["music", "medicine", "cycling", "cooking"],
      relationship_goal: "long-term",
    },
    astrology: {
      sun_sign: "Gemini",
      moon_sign: "Libra",
      reading:
        "Versatile and sociable, you bring light into every room. You thrive in partnerships that blend intellectual freedom with emotional warmth.",
      dob: "1994-05-22",
      time: "11:00",
      place: "Pune, India",
    },
    partner_preferences: {
      age_range: [25, 30],
      preferred_cities: ["Pune", "Mumbai"],
      religion_preference: "Hindu",
    },
    verification: { status: "verified" },
    profile_photo: "https://i.pravatar.cc/300?img=33",
    compatibility: 68,
    profile_views: 156,
    created_at: "2025-09-15T08:00:00Z",
    last_active: "2026-04-12T09:00:00Z",
  },
  {
    id: "user_005",
    email: "aisha@example.com",
    role: "user",
    basic_info: {
      full_name: "Aisha Khan",
      age: 25,
      gender: "Female",
      city: "Hyderabad",
      state: "Telangana",
      religion: "Muslim",
      mother_tongue: "Urdu",
      height: "5'5\"",
      phone: "+919876543214",
    },
    professional_info: {
      education: "MBA",
      occupation: "Marketing Manager",
      annual_income: "6-10L",
      company: "HUL",
    },
    ai_profile: {
      bio: "Creative thinker, marketing storyteller. I believe every brand — and every person — has a story worth telling. Seeking someone who writes their own.",
      interests: ["marketing", "writing", "art", "fitness"],
      relationship_goal: "long-term",
    },
    astrology: {
      sun_sign: "Aquarius",
      moon_sign: "Gemini",
      reading:
        "Independent and visionary, you chart your own course. You seek a partner who respects your freedom while building a meaningful shared world.",
      dob: "2001-02-08",
      time: "09:30",
      place: "Hyderabad, India",
    },
    partner_preferences: {
      age_range: [25, 33],
      preferred_cities: ["Hyderabad", "Bangalore", "Mumbai"],
      religion_preference: "Muslim",
    },
    verification: { status: "rejected" },
    profile_photo: "https://i.pravatar.cc/300?img=9",
    compatibility: 81,
    profile_views: 73,
    created_at: "2026-01-10T14:00:00Z",
    last_active: "2026-04-10T18:00:00Z",
  },
];

let MOCK_INTERESTS = [
  {
    id: "int_001",
    sender_id: "user_002",
    receiver_id: "user_001",
    message: "Hi! I loved your profile, would love to connect!",
    status: "pending",
    created_at: "2026-04-13T10:00:00Z",
    sender: MOCK_USERS[1],
  },
  {
    id: "int_002",
    sender_id: "user_004",
    receiver_id: "user_001",
    message: "Your love for sci-fi caught my eye. Let's talk books!",
    status: "accepted",
    created_at: "2026-04-10T08:00:00Z",
    sender: MOCK_USERS[3],
  },
  {
    id: "int_003",
    sender_id: "user_001",
    receiver_id: "user_003",
    message: "Hi Sneha! Both of us seem to love data and travel.",
    status: "pending",
    created_at: "2026-04-12T12:00:00Z",
    receiver: MOCK_USERS[2],
  },
  {
    id: "int_004",
    sender_id: "user_001",
    receiver_id: "user_005",
    message: "Your creative outlook is truly inspiring!",
    status: "declined",
    created_at: "2026-04-08T16:00:00Z",
    receiver: MOCK_USERS[4],
  },
];

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * POST /auth/register
 */
export const register = async (email, password, role = "user") => {
  await delay(1000);
  const existing = MOCK_USERS.find((u) => u.email === email);
  if (existing) throw new Error("Email already registered.");
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    role,
    basic_info: { full_name: email.split("@")[0], age: null, gender: null, city: null },
    ai_profile: { bio: "", interests: [], relationship_goal: "" },
    professional_info: {},
    astrology: null,
    partner_preferences: {},
    verification: { status: "pending" },
    profile_photo: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
    compatibility: null,
    profile_views: 0,
    created_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  };
  MOCK_USERS.push(newUser);
  return { user: newUser, message: "User registered successfully." };
};

/**
 * POST /auth/login
 * Returns { access_token, token_type, user }
 */
export const login = async (email, password) => {
  await delay(1200);
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) throw new Error("Invalid email or password.");
  // Mock JWT — encode role in a readable fake token
  const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 }));
  return { access_token: fakeToken, token_type: "bearer", user };
};

/**
 * GET /auth/me
 * Reads from localStorage token (decoded here)
 */
export const getMe = async (token) => {
  await delay(600);
  try {
    const decoded = JSON.parse(atob(token));
    const user = MOCK_USERS.find((u) => u.id === decoded.id);
    if (!user) throw new Error("User not found.");
    return user;
  } catch {
    throw new Error("Invalid or expired token.");
  }
};

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * GET /users/:user_id
 */
export const getUserById = async (userId) => {
  await delay(800);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw new Error("User not found.");
  return user;
};

/**
 * PUT /users/:user_id
 * Partial update — merges nested objects
 */
export const updateUserProfile = async (userId, updates) => {
  await delay(1000);
  const idx = MOCK_USERS.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  MOCK_USERS[idx] = {
    ...MOCK_USERS[idx],
    ...updates,
    basic_info: { ...MOCK_USERS[idx].basic_info, ...(updates.basic_info || {}) },
    professional_info: { ...MOCK_USERS[idx].professional_info, ...(updates.professional_info || {}) },
    ai_profile: { ...MOCK_USERS[idx].ai_profile, ...(updates.ai_profile || {}) },
    partner_preferences: { ...MOCK_USERS[idx].partner_preferences, ...(updates.partner_preferences || {}) },
  };
  return MOCK_USERS[idx];
};

/**
 * POST /users/upload-id
 * Simulates ID upload — sets verification status to "pending"
 */
export const uploadIdForVerification = async (userId, file) => {
  await delay(1500);
  const idx = MOCK_USERS.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    MOCK_USERS[idx].verification = { status: "pending", doc_name: file.name };
  }
  return { message: "ID uploaded. Verification pending admin review." };
};

// ─── AI ──────────────────────────────────────────────────────────────────────

/**
 * POST /ai/enhance-bio
 * { raw_text } → { enhanced_bio }
 */
export const enhanceBio = async (rawText) => {
  await delay(1800);
  if (!rawText || rawText.trim().length < 10) throw new Error("Please enter at least 10 characters.");
  const enhanced =
    `✨ ${rawText.trim().charAt(0).toUpperCase() + rawText.trim().slice(1)}` +
    " I'm passionate about building genuine connections and believe that the right relationship begins with honesty and shared values. " +
    "If you're looking for someone who brings both warmth and depth into a relationship, let's start a conversation.";
  return { enhanced_bio: enhanced };
};

/**
 * POST /ai/icebreakers
 * { target_id } → { icebreakers: string[] }
 */
export const getIcebreakers = async (targetId) => {
  await delay(2000);
  const target = MOCK_USERS.find((u) => u.id === targetId);
  const interests = target?.ai_profile?.interests || ["travel", "music"];
  const starters = [
    `Both of you seem to love ${interests[0]}! Ask them about their favourite ${interests[0]} experience so far.`,
    `You both value meaningful connections — ask them what their idea of a perfect weekend looks like.`,
    `Their interest in ${interests[1] || "their work"} is fascinating. What inspired them to pursue it?`,
  ];
  return { icebreakers: starters };
};

/**
 * POST /ai/generate-astrology
 * { dob, time, place } → { sun_sign, moon_sign, reading }
 */
export const generateAstrology = async (dob, time, place) => {
  await delay(2000);
  if (!dob || !time || !place) throw new Error("Date, time, and place of birth are required.");
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const month = new Date(dob).getMonth();
  const sun_sign = signs[month];
  const moon_sign = signs[(month + 4) % 12];
  const reading = `As a ${sun_sign} with ${moon_sign} moon, you possess a rare blend of passion and emotional depth. Born in ${place}, the stars aligned to give you an intuitive and driven nature. Your ideal partner mirrors your values while bringing a complementary energy that helps you grow.`;
  return { sun_sign, moon_sign, reading, dob, time, place };
};

// ─── Matches ─────────────────────────────────────────────────────────────────

/**
 * POST /matches
 * { raw: string } → UserOut[]
 * Filters by opposite gender of current user (mock: always returns mix)
 */
export const getMatches = async (query = "") => {
  await delay(1200);
  let results = [...MOCK_USERS].filter((u) => u.id !== "user_001"); // exclude self
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (u) =>
        u.ai_profile.bio.toLowerCase().includes(q) ||
        u.ai_profile.interests.some((i) => i.includes(q)) ||
        u.basic_info.occupation?.toLowerCase().includes(q) ||
        u.basic_info.city.toLowerCase().includes(q)
    );
  }
  return results;
};

// ─── Interests ───────────────────────────────────────────────────────────────

/**
 * POST /interests
 * { receiver_id, message } → Interest object
 */
export const sendInterest = async (receiverId, message = "") => {
  await delay(1000);
  const alreadySent = MOCK_INTERESTS.find(
    (i) => i.sender_id === "user_001" && i.receiver_id === receiverId
  );
  if (alreadySent) throw new Error("You have already sent an interest to this user.");
  const newInterest = {
    id: `int_${Date.now()}`,
    sender_id: "user_001",
    receiver_id: receiverId,
    message,
    status: "pending",
    created_at: new Date().toISOString(),
    receiver: MOCK_USERS.find((u) => u.id === receiverId),
  };
  MOCK_INTERESTS.push(newInterest);
  return newInterest;
};

/**
 * GET /interests/sent
 */
export const getSentInterests = async () => {
  await delay(900);
  return MOCK_INTERESTS.filter((i) => i.sender_id === "user_001");
};

/**
 * GET /interests/received
 */
export const getReceivedInterests = async () => {
  await delay(900);
  return MOCK_INTERESTS.filter((i) => i.receiver_id === "user_001");
};

/**
 * PATCH /interests/:id?status=accepted|declined
 */
export const respondToInterest = async (interestId, status) => {
  await delay(800);
  const idx = MOCK_INTERESTS.findIndex((i) => i.id === interestId);
  if (idx === -1) throw new Error("Interest not found.");
  MOCK_INTERESTS[idx] = { ...MOCK_INTERESTS[idx], status };
  return MOCK_INTERESTS[idx];
};

// ─── Admin ───────────────────────────────────────────────────────────────────

/**
 * GET /admin/pending-verifications
 */
export const getPendingVerifications = async () => {
  await delay(1000);
  return MOCK_USERS.filter((u) => u.verification.status === "pending").map((u) => ({
    ...u,
    id_document: {
      url: `https://picsum.photos/seed/${u.id}/400/250`,
      type: "Aadhaar Card",
      uploaded_at: u.created_at,
      file_size: "2.3 MB",
    },
  }));
};

/**
 * PATCH /admin/verify/:user_id?action=approve|reject
 */
export const verifyUser = async (userId, action) => {
  await delay(900);
  const idx = MOCK_USERS.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  MOCK_USERS[idx].verification.status = action === "approve" ? "verified" : "rejected";
  return { message: `User ${action === "approve" ? "approved" : "rejected"} successfully.`, user: MOCK_USERS[idx] };
};

/**
 * DELETE /admin/users/:user_id
 */
export const deleteUser = async (userId) => {
  await delay(800);
  const idx = MOCK_USERS.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  MOCK_USERS.splice(idx, 1);
  return { message: "User deleted successfully." };
};