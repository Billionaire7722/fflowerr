# Flower Shop (fflowerr)

**Overview**
The Flower app is a 3-part stack (backend API + client storefront + admin panel) deployed on the VPS using Docker. It reuses the existing rental PostgreSQL server to save RAM.

**Repo Locations**
- Local: `D:\Flowers`
- VPS: `/root/fflowerr`

**Services & Ports (VPS)**
- Client (Next.js): `http://103.200.22.111:3110`
- API (NestJS): `http://103.200.22.111:3111`
- Admin (Vite/Nginx): `http://103.200.22.111:3112`

**Current VPS Architecture (Important)**
- Flower services run in `/root/fflowerr` via `docker-compose.vps.yml`.
- Flower backend connects to the existing rental Postgres container (`rental_postgres`) on the external network `rental_network`.
- Database used by Flower: `flower_shop` (inside the existing Postgres server).
- **Do NOT create a new Postgres container.**

**Docker Architecture (Important)**
- `flower_net` (internal) for Flower services.
- `rental_network` (external) for DB access only.
- Only `flower-backend` joins `rental_network`.

**Avoiding Conflicts with Rental (Important)**
- Do **not** change the rental compose files or containers.
- Keep Flower ports at `3110/3111/3112` (rental uses 3000/3002/5174).
- Do not remove or rename `rental_network`.
- Avoid `docker system prune` on the VPS unless you are sure it is safe.

**Local Development**
Backend:
1. `cd D:\Flowers\backend`
2. `npm install`
3. `npm run start:dev` (default port 3100)

Client:
1. `cd D:\Flowers\client`
2. `npm install`
3. `npm run dev` (port 3003)

Admin:
1. `cd D:\Flowers\admin`
2. `npm install`
3. `npm run dev` (port 3004)

**Environment Variables**
- Backend: `DATABASE_URL` in `backend/.env`
- Client: `NEXT_PUBLIC_API_BASE_URL`
- Admin: `VITE_API_BASE_URL`

**Deploy / Redeploy (Manual)**
On VPS:
1. `cd /root/fflowerr`
2. `git pull --ff-only`
3. Ensure `/root/fflowerr/.env.vps` exists
4. `docker-compose --env-file ./.env.vps -f docker-compose.vps.yml up -d --build`

**Automation Script (Recommended)**
Use `D:\Flowers\scripts\deploy.ps1` to commit, push, and redeploy.

Run:
```
PowerShell -ExecutionPolicy Bypass -File D:\Flowers\scripts\deploy.ps1 -Message "your commit message"
```

**How to Edit `D:\rental\README.md` (Important)**
- Open the file: `D:\rental\README.md`
- Update only the rental project information.
- **Do not copy Flower-specific commands or ports into the rental README.**
- Keep rental and flower deployment notes separate to avoid accidental conflicts.

If you update this README, keep the bold sections intact so new teammates and agents can quickly understand the critical constraints.
