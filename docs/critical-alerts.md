# CRM AI CORE - ALERTAS CRÍTICAS

## AI CHAT NO APARECE

Verificar:

* app/dashboard/page.tsx
* import AIChat
* <AIChat />
* app/api/ai-chat
* ai-server/server.js

Comando:

node server.js

Puerto esperado:

4000

---

## PIPELINE MUESTRA TODO EN CERO

Verificar:

GRANT SELECT ON public.leads TO authenticated;

Verificar:

user_id

Verificar:

PIPELINE USER
PIPELINE LEADS

en consola.

---

## DASHBOARD EN CERO

Verificar:

lib/dashboard-data.ts

Verificar:

tabla leads

Verificar:

status

Valores válidos:

* Nuevo
* Contactado
* Cerrado

---

## ERROR CHART WIDTH(-1)

Revisar:

* DashboardAnalytics.tsx
* Recharts
* ResponsiveContainer

Síntoma:

The width(-1) and height(-1) of chart should be greater than 0

---

## AI SERVER CAÍDO

Síntoma:

curl http://127.0.0.1:4000

No responde.

Solución:

cd ai-server
node server.js

Resultado esperado:

🔥 AI SERVER RUNNING ON 4000

---

## ARCHIVOS MÁS IMPORTANTES DEL SISTEMA

app/dashboard/page.tsx

app/pipeline/page.tsx

components/AIChat.tsx

components/PipelineClient.tsx

components/PipelineBoard.tsx

app/api/ai-chat/route.ts

app/api/leads/route.ts

ai-server/server.js

lib/dashboard-data.ts
