create extension if not exists pgcrypto;


-- =========================================================
-- IDENTITIES
-- =========================================================

create table public.identities (
    id uuid primary key default gen_random_uuid(),

    public_key text not null unique,

    key_algorithm text not null default 'ECDSA-P256-SHA256',

    callsign text not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    revoked_at timestamptz
);


-- =========================================================
-- CHALLENGES
-- =========================================================

create table public.challenges (
    id uuid primary key default gen_random_uuid(),

    identity_id uuid not null
        references public.identities(id)
        on delete cascade,

    challenge_hash text not null unique,

    expires_at timestamptz not null,

    used_at timestamptz,

    created_at timestamptz not null default now()
);


-- =========================================================
-- SESSIONS
-- =========================================================

create table public.sessions (
    id uuid primary key default gen_random_uuid(),

    identity_id uuid not null
        references public.identities(id)
        on delete cascade,

    token_hash text not null unique,

    created_at timestamptz not null default now(),

    expires_at timestamptz not null,

    revoked_at timestamptz,

    last_seen_at timestamptz
);


-- =========================================================
-- ROOMS
-- =========================================================

create table public.rooms (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,

    owner_id uuid not null
        references public.identities(id)
        on delete restrict,

    created_at timestamptz not null default now(),

    expires_at timestamptz,

    deleted_at timestamptz
);


-- =========================================================
-- ROOM MEMBERS
-- =========================================================

create table public.room_members (
    room_id uuid not null
        references public.rooms(id)
        on delete cascade,

    identity_id uuid not null
        references public.identities(id)
        on delete cascade,

    joined_at timestamptz not null default now(),

    left_at timestamptz,

    primary key (room_id, identity_id)
);


-- =========================================================
-- MESSAGES
-- =========================================================

create table public.messages (
    id uuid primary key default gen_random_uuid(),

    room_id uuid not null
        references public.rooms(id)
        on delete cascade,

    sender_id uuid not null
        references public.identities(id)
        on delete restrict,

    morse text not null,

    created_at timestamptz not null default now()
);


-- =========================================================
-- INDEXES
-- =========================================================

create index challenges_identity_id_idx
    on public.challenges(identity_id);

create index challenges_expires_at_idx
    on public.challenges(expires_at);

create index sessions_identity_id_idx
    on public.sessions(identity_id);

create index sessions_expires_at_idx
    on public.sessions(expires_at);

create index room_members_identity_id_idx
    on public.room_members(identity_id);

create index messages_room_created_idx
    on public.messages(room_id, created_at desc);

create index messages_sender_id_idx
    on public.messages(sender_id);


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.identities enable row level security;
alter table public.challenges enable row level security;
alter table public.sessions enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;