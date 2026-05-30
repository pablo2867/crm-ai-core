# CRM AI CORE - PROJECT MAP

## COMPONENTES CRÍTICOS

### Dashboard

Archivo principal:

app/dashboard/page.tsx

Dependencias:

* AIChat.tsx
* AIAssistantCard.tsx
* DashboardHeader.tsx
* DashboardStats.tsx
* DashboardAnalytics.tsx
* DashboardWidgets.tsx
* RealtimeLeads.tsx

---

### AI COPILOT

Componente:

components/AIChat.tsx

Flujo:

AIChat.tsx
↓
/api/ai-chat
↓
AI Server
↓
Supabase
↓
Respuesta IA

Servidor:

ai-server/server.js

Puerto:

4000

Comando:

node server.js

---

### Leads

API:

app/api/leads/route.ts

Tabla:

leads

Dependencias:

* user_id
* status
* ai_temperature

---

### Pipeline

Archivo:

app/pipeline/page.tsx

Componentes:

* PipelineClient.tsx
* PipelineBoard.tsx
* DashboardStats.tsx

Dependencias:

Supabase
↓
leads.user_id

---

### Analytics

Dependencias:

getDashboardData()

Componentes:

* DashboardAnalytics.tsx

---

## ARCHIVOS QUE NO DEBEN ELIMINARSE

components/AIChat.tsx

components/PipelineClient.tsx

components/PipelineBoard.tsx

components/AIAssistantCard.tsx

components/dashboard/DashboardAnalytics.tsx

app/api/ai-chat/route.ts

app/api/leads/route.ts

ai-server/server.js

lib/dashboard-data.ts

---

## VERIFICACIÓN RÁPIDA

Si desaparece AI Chat:

1. Revisar AIChat.tsx
2. Revisar app/api/ai-chat
3. Revisar ai-server/server.js
4. Verificar puerto 4000
5. Verificar import AIChat en dashboard/page.tsx

---

## ESTADO ACTUAL

Dashboard: OK

Pipeline: OK

Analytics: OK

AI Chat: OK

AI Server: OK

Supabase: OK
