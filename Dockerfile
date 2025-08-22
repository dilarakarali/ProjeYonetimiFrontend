# --- Aşama 1: Build (İnşa Etme) ---
FROM node:18-alpine AS builder

# Çalışma dizinini /app olarak ayarla
WORKDIR /app

# ÖNEMLİ: Asıl projenin olduğu 'start' klasörünün içindeki package.json dosyalarını kopyala
COPY start/package*.json ./

# Bağımlılıkları kur
# RUN npm install
# Bağımlılıkları 'package-lock.json' dosyasına göre tam olarak kur
RUN npm ci

COPY start/. .

# Node.js için bellek limitini ayarla (Render'ın ücretsiz katmanı için)
ENV NODE_OPTIONS=--max-old-space-size=460


# Vite projesini build et
RUN npm run build


# --- Aşama 2: Serve (Sunma) ---
FROM nginx:stable-alpine

# Vite, build sonucunu "dist" adında bir klasöre koyar.
# Bu "dist" klasörünü Nginx'in sunum klasörüne kopyala.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx'in 80 portunu dışarıya aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]