import { useState, useEffect, useRef } from "react";

// TODO: Reemplazar con paleta de colores oficial de Mira Aya desde App Store
const COLORS = {
  bg: "#0D0B1E",
  bgCard: "#1A1730",
  bgCardLight: "#221E3A",
  accent: "#C084FC",
  accentSecondary: "#818CF8",
  accentTertiary: "#F472B6",
  accentGold: "#FBBF24",
  textPrimary: "#F8F7FF",
  textSecondary: "#B8B5D4",
  textMuted: "#6B6890",
  border: "#2E2A4A",
  success: "#34D399",
  gradStart: "#C084FC",
  gradEnd: "#818CF8",
};

// TODO: Afirmaciones reales generadas por IA — integrar API
const AFIRMACIONES = [
  "Soy digna/o de todo lo que deseo manifestar",
  "Mi mente es poderosa y crea mi realidad",
  "Atraigo abundancia, amor y paz hacia mi vida",
  "Confío en el proceso y fluyo con el universo",
  "Cada día me acerco más a mi yo soñado",
  "Soy luz, soy amor, soy todo lo que necesito",
  "Mis sueños tienen el poder de hacerse realidad",
  "Vivo con gratitud y todo se multiplica",
  "Soy capaz de lograr todo lo que me propongo",
  "El universo conspira siempre a mi favor",
];

// TODO: Datos de hábitos reales con tracking persistente
const HABITOS_INICIALES = [
  { id: 1, icon: "🧘", nombre: "Meditación", completado: false, racha: 5, meta: "10 min" },
  { id: 2, icon: "📓", nombre: "Journaling", completado: false, racha: 3, meta: "5 páginas" },
  { id: 3, icon: "🌅", nombre: "Rutina matutina", completado: false, racha: 7, meta: "Diario" },
  { id: 4, icon: "💧", nombre: "Hidratación", completado: false, racha: 12, meta: "8 vasos" },
  { id: 5, icon: "✨", nombre: "Visualización", completado: false, racha: 2, meta: "15 min" },
  { id: 6, icon: "🏃", nombre: "Movimiento", completado: false, racha: 4, meta: "30 min" },
];

// TODO: Entradas reales del diario con almacenamiento local/nube
const DIARIO_INICIAL = [
  {
    id: 1,
    fecha: "Hoy",
    titulo: "Gratitud del día",
    contenido: "Hoy me siento agradecida por la paz que siento...",
    emoji: "🌸",
    tipo: "gratitud",
  },
  {
    id: 2,
    fecha: "Ayer",
    titulo: "Mi visión de futuro",
    contenido: "Me veo viviendo en un lugar lleno de luz y tranquilidad...",
    emoji: "✨",
    tipo: "vision",
  },
];

// TODO: Metas del tablero de visión con imágenes reales del usuario
const METAS_VISION = [
  { id: 1, titulo: "Salud radiante", emoji: "💪", color: "#C084FC", progreso: 65 },
  { id: 2, titulo: "Abundancia", emoji: "💰", color: "#FBBF24", progreso: 40 },
  { id: 3, titulo: "Amor propio", emoji: "💗", color: "#F472B6", progreso: 80 },
  { id: 4, titulo: "Carrera soñada", emoji: "🚀", color: "#818CF8", progreso: 55 },
  { id: 5, titulo: "Paz interior", emoji: "🕊️", color: "#34D399", progreso: 70 },
  { id: 6, titulo: "Relaciones", emoji: "🤝", color: "#FB923C", progreso: 60 },
];

// Partículas de fondo
function Particulas() {
  const particulas = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particulas.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `rgba(192, 132, 252, ${Math.random() * 0.5 + 0.1})`,
            animation: `flotar ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// Barra de progreso circular
function ProgressCircle({ value, size = 60, color = COLORS.accent, bg = COLORS.border }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

// Componente BarraProgreso lineal
function BarraProgreso({ valor, color }) {
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 6, overflow: "hidden", width: "100%" }}>
      <div
        style={{
          height: "100%",
          width: `${valor}%`,
          background: color,
          borderRadius: 99,
          transition: "width 1s ease",
        }}
      />
    </div>
  );
}

// ======================== PANTALLAS ========================

function PantallaInicio({ setTab }) {
  const [afirmacionIdx, setAfirmacionIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setAfirmacionIdx((i) => (i + 1) % AFIRMACIONES.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const hoy = new Date();
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  return (
    <div style={{ padding: "0 0 100px" }}>
      {/* Header */}
      <div
        style={{
          padding: "56px 20px 24px",
          background: `linear-gradient(180deg, rgba(192,132,252,0.15) 0%, transparent 100%)`,
          textAlign: "center",
        }}
      >
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 4 }}>
          {dias[hoy.getDay()]}, {hoy.getDate()} de {meses[hoy.getMonth()]}
        </p>
        {/* TODO: Personalizar saludo con nombre del usuario */}
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 4px" }}>
          Hola, alma hermosa ✨
        </h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>
          Tu manifestación comienza aquí
        </p>
      </div>

      {/* Afirmación del día */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentSecondary}22)`,
            border: `1px solid ${COLORS.accent}44`,
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `${COLORS.accent}11`,
            }}
          />
          <p style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
            AFIRMACIÓN DEL DÍA
          </p>
          <p
            style={{
              color: COLORS.textPrimary,
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.5,
              margin: "0 0 16px",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.4s ease",
              minHeight: 60,
            }}
          >
            "{AFIRMACIONES[afirmacionIdx]}"
          </p>
          <button
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setAfirmacionIdx((i) => (i + 1) % AFIRMACIONES.length);
                setFade(true);
              }, 300);
            }}
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
              border: "none",
              borderRadius: 12,
              padding: "8px 20px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Nueva afirmación ✨
          </button>
        </div>
      </div>

      {/* Resumen del día */}
      <div style={{ padding: "0 20px 20px" }}>
        <h2 style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Tu progreso hoy
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Hábitos", valor: "2/6", icon: "✅", color: COLORS.success, sub: "completados" },
            { label: "Racha", valor: "7 días", icon: "🔥", color: COLORS.accentGold, sub: "consecutivos" },
            { label: "Notas", valor: "3", icon: "📓", color: COLORS.accentTertiary, sub: "esta semana" },
            { label: "Energía", valor: "Alta", icon: "⚡", color: COLORS.accent, sub: "hoy" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: COLORS.bgCard,
                borderRadius: 16,
                padding: "16px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: 20, fontWeight: 700 }}>{stat.valor}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div style={{ padding: "0 20px 20px" }}>
        <h2 style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Acciones rápidas
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "🧘", label: "Comenzar meditación", sub: "10 minutos de paz interior", color: COLORS.accent, tab: "meditacion" },
            { icon: "📝", label: "Escribir en mi diario", sub: "Registra tus pensamientos", color: COLORS.accentTertiary, tab: "diario" },
            { icon: "🎯", label: "Ver mis metas", sub: "Tablero de visión", color: COLORS.accentSecondary, tab: "metas" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setTab(a.tab)}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.15s, background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bgCardLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.bgCard)}
            >
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 14 }}>{a.label}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{a.sub}</div>
              </div>
              <span style={{ color: a.color, fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cita motivacional */}
      <div style={{ padding: "0 20px" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accentTertiary}22, ${COLORS.accentGold}11)`,
            border: `1px solid ${COLORS.accentTertiary}33`,
            borderRadius: 16,
            padding: 16,
            textAlign: "center",
          }}
        >
          {/* TODO: Integrar API de citas motivacionales */}
          <p style={{ color: COLORS.textSecondary, fontSize: 13, fontStyle: "italic", margin: 0 }}>
            "Lo que la mente puede concebir y creer, puede lograrlo." — Napoleon Hill
          </p>
        </div>
      </div>
    </div>
  );
}

function PantallaHabitos() {
  const [habitos, setHabitos] = useState(HABITOS_INICIALES);

  const toggleHabito = (id) => {
    setHabitos((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completado: !h.completado } : h))
    );
  };

  const completados = habitos.filter((h) => h.completado).length;
  const porcentaje = Math.round((completados / habitos.length) * 100);

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ padding: "56px 20px 20px" }}>
        <h1 style={{ color: COLORS.textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Mis hábitos ✅
        </h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>
          Construye tu yo soñado un día a la vez
        </p>
      </div>

      {/* Progreso circular */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: COLORS.bgCard,
            borderRadius: 20,
            padding: 24,
            display: "flex",
            alignItems: "center",
            gap: 20,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <ProgressCircle value={porcentaje} size={80} color={COLORS.accent} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: 18 }}>{porcentaje}%</span>
            </div>
          </div>
          <div>
            <div style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: 18 }}>
              {completados} de {habitos.length}
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 13 }}>hábitos completados hoy</div>
            <div style={{ color: COLORS.accentGold, fontSize: 13, marginTop: 4 }}>
              🔥 Racha máxima: 12 días
            </div>
          </div>
        </div>
      </div>

      {/* Lista de hábitos */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {habitos.map((habito) => (
            <div
              key={habito.id}
              onClick={() => toggleHabito(habito.id)}
              style={{
                background: habito.completado
                  ? `${COLORS.success}11`
                  : COLORS.bgCard,
                border: `1px solid ${habito.completado ? COLORS.success + "44" : COLORS.border}`,
                borderRadius: 16,
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 28 }}>{habito.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: habito.completado ? COLORS.success : COLORS.textPrimary,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: habito.completado ? "line-through" : "none",
                  }}
                >
                  {habito.nombre}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 12 }}>🎯 {habito.meta}</span>
                  <span style={{ color: COLORS.accentGold, fontSize: 12 }}>🔥 {habito.racha} días</span>
                </div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `2px solid ${habito.completado ? COLORS.success : COLORS.border}`,
                  background: habito.completado ? COLORS.success : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {habito.completado && (
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agregar hábito */}
      <div style={{ padding: "16px 20px 0" }}>
        {/* TODO: Modal para agregar hábitos personalizados */}
        <button
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentSecondary}22)`,
            border: `2px dashed ${COLORS.accent}44`,
            borderRadius: 16,
            padding: "14px",
            color: COLORS.accent,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Agregar nuevo hábito
        </button>
      </div>
    </div>
  );
}

function PantallaDiario() {
  const [entradas, setEntradas] = useState(DIARIO_INICIAL);
  const [modo, setModo] = useState("lista"); // lista | nueva
  const [nuevaEntrada, setNuevaEntrada] = useState({ titulo: "", contenido: "", emoji: "✨", tipo: "libre" });

  const tipos = [
    { id: "gratitud", label: "Gratitud", emoji: "🙏", color: COLORS.accentGold },
    { id: "vision", label: "Visión", emoji: "🌟", color: COLORS.accent },
    { id: "emociones", label: "Emociones", emoji: "💜", color: COLORS.accentTertiary },
    { id: "libre", label: "Libre", emoji: "📝", color: COLORS.accentSecondary },
  ];

  const guardarEntrada = () => {
    if (!nuevaEntrada.titulo || !nuevaEntrada.contenido) return;
    const tipoObj = tipos.find((t) => t.id === nuevaEntrada.tipo);
    setEntradas((prev) => [
      {
        id: Date.now(),
        fecha: "Ahora",
        ...nuevaEntrada,
        emoji: tipoObj?.emoji || "✨",
      },
      ...prev,
    ]);
    setNuevaEntrada({ titulo: "", contenido: "", emoji: "✨", tipo: "libre" });
    setModo("lista");
  };

  if (modo === "nueva") {
    return (
      <div style={{ padding: "0 0 100px" }}>
        <div
          style={{
            padding: "56px 20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ color: COLORS.textPrimary, fontSize: 22, fontWeight: 700, margin: 0 }}>
            Nueva entrada 📓
          </h1>
          <button
            onClick={() => setModo("lista")}
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "8px 14px",
              color: COLORS.textSecondary,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancelar
          </button>
        </div>

        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Tipo */}
          <div>
            <p style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>TIPO DE ENTRADA</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tipos.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setNuevaEntrada((p) => ({ ...p, tipo: t.id }))}
                  style={{
                    background: nuevaEntrada.tipo === t.id ? `${t.color}33` : COLORS.bgCard,
                    border: `1px solid ${nuevaEntrada.tipo === t.id ? t.color : COLORS.border}`,
                    borderRadius: 10,
                    padding: "8px 14px",
                    color: nuevaEntrada.tipo === t.id ? t.color : COLORS.textSecondary,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <p style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>TÍTULO</p>
            <input
              value={nuevaEntrada.titulo}
              onChange={(e) => setNuevaEntrada((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="¿Sobre qué escribirás hoy?"
              style={{
                width: "100%",
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                color: COLORS.textPrimary,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Contenido */}
          <div>
            <p style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>CONTENIDO</p>
            <textarea
              value={nuevaEntrada.contenido}
              onChange={(e) => setNuevaEntrada((p) => ({ ...p, contenido: e.target.value }))}
              placeholder="Escribe libremente... El universo escucha"
              rows={8}
              style={{
                width: "100%",
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                color: COLORS.textPrimary,
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                lineHeight: 1.6,
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={guardarEntrada}
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
              border: "none",
              borderRadius: 14,
              padding: "14px",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Guardar entrada ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div
        style={{
          padding: "56px 20px 20px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ color: COLORS.textPrimary, fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>
            Mi diario 📓
          </h1>
          <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>
            Reflexiones de tu alma
          </p>
        </div>
        <button
          onClick={() => setModo("nueva")}
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
            border: "none",
            borderRadius: 12,
            padding: "10px 16px",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Nueva
        </button>
      </div>

      {/* Prompts del día */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accentTertiary}22, ${COLORS.accent}11)`,
            border: `1px solid ${COLORS.accentTertiary}33`,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <p style={{ color: COLORS.accentTertiary, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
            PREGUNTA DEL DÍA
          </p>
          {/* TODO: Rotar preguntas diarias desde base de datos */}
          <p style={{ color: COLORS.textPrimary, fontSize: 14, margin: 0 }}>
            ¿Qué versión de ti mismo/a quieres celebrar hoy? 🌸
          </p>
        </div>
      </div>

      {/* Entradas */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {entradas.map((entrada) => {
          const tipoObj = tipos.find((t) => t.id === entrada.tipo) || tipos[3];
          return (
            <div
              key={entrada.id}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 16,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bgCardLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.bgCard)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{entrada.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 14 }}>
                    {entrada.titulo}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: COLORS.textMuted, fontSize: 11 }}>{entrada.fecha}</span>
                    <span
                      style={{
                        background: `${tipoObj.color}22`,
                        color: tipoObj.color,
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontWeight: 600,
                      }}
                    >
                      {tipoObj.label}
                    </span>
                  </div>
                </div>
              </div>
              <p
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.5,
                  margin: 0,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {entrada.contenido}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PantallaVisualizacion() {
  const [modoActivo, setModoActivo] = useState("respira"); // respira | visualiza | afirma
  const [respirando, setRespirando] = useState(false);
  const [fase, setFase] = useState("listo"); // listo | inhala | retén | exhala
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);

  const iniciarRespiracion = () => {
    if (respirando) {
      clearInterval(timerRef.current);
      setRespirando(false);
      setFase("listo");
      return;
    }
    setRespirando(true);
    // Ciclo: 4s inhala, 4s retén, 6s exhala
    let ciclo = 0;
    const ciclos = [
      { fase: "inhala", dur: 4 },
      { fase: "retén", dur: 4 },
      { fase: "exhala", dur: 6 },
    ];
    let idxCiclo = 0;
    let t = ciclos[idxCiclo].dur;
    setFase(ciclos[idxCiclo].fase);
    setSegundos(t);

    timerRef.current = setInterval(() => {
      t--;
      setSegundos(t);
      if (t <= 0) {
        idxCiclo = (idxCiclo + 1) % ciclos.length;
        t = ciclos[idxCiclo].dur;
        setFase(ciclos[idxCiclo].fase);
        setSegundos(t);
        ciclo++;
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const faseColor = {
    listo: COLORS.accent,
    inhala: COLORS.success,
    retén: COLORS.accentGold,
    exhala: COLORS.accentSecondary,
  };

  const tabs = [
    { id: "respira", label: "Respiración", icon: "🌬️" },
    { id: "visualiza", label: "Visualiza", icon: "🌟" },
    { id: "afirma", label: "Afirmaciones", icon: "💫" },
  ];

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ padding: "56px 20px 20px" }}>
        <h1 style={{ color: COLORS.textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Meditación 🧘
        </h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>
          Conecta con tu ser interior
        </p>
      </div>

      {/* Sub-tabs */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            display: "flex",
            background: COLORS.bgCard,
            borderRadius: 14,
            padding: 4,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setModoActivo(t.id)}
              style={{
                flex: 1,
                background: modoActivo === t.id
                  ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`
                  : "transparent",
                border: "none",
                borderRadius: 10,
                padding: "10px 4px",
                color: modoActivo === t.id ? "#fff" : COLORS.textMuted,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {modoActivo === "respira" && (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>
              Técnica 4-4-6 para calmar la mente
            </p>
          </div>

          {/* Círculo respiración */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${faseColor[fase]}33, ${faseColor[fase]}11)`,
              border: `3px solid ${faseColor[fase]}55`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              transition: "all 0.8s ease",
              animation: respirando ? `pulsar-respiracion 2s ease-in-out infinite` : "none",
            }}
          >
            <span style={{ fontSize: 40 }}>🌬️</span>
            <span
              style={{
                color: faseColor[fase],
                fontSize: 18,
                fontWeight: 700,
                textTransform: "capitalize",
                marginTop: 8,
              }}
            >
              {fase === "listo" ? "Listo" : fase}
            </span>
            {respirando && (
              <span style={{ color: COLORS.textSecondary, fontSize: 28, fontWeight: 700 }}>
                {segundos}
              </span>
            )}
          </div>

          <button
            onClick={iniciarRespiracion}
            style={{
              background: respirando
                ? `${COLORS.accentTertiary}22`
                : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
              border: respirando ? `2px solid ${COLORS.accentTertiary}` : "none",
              borderRadius: 16,
              padding: "14px 40px",
              color: respirando ? COLORS.accentTertiary : "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {respirando ? "⏹ Detener" : "▶ Comenzar"}
          </button>

          <div style={{ marginTop: 24, width: "100%" }}>
            <div style={{ background: COLORS.bgCard, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.textMuted, fontSize: 12, textAlign: "center", margin: 0 }}>
                🟢 Inhala 4s &nbsp;&nbsp; 🟡 Retén 4s &nbsp;&nbsp; 🔵 Exhala 6s
              </p>
            </div>
          </div>
        </div>
      )}

      {modoActivo === "visualiza" && (
        <div style={{ padding: "0 20px" }}>
          {/* TODO: Audio de meditación guiada */}
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentSecondary}11)`,
              borderRadius: 20,
              padding: 24,
              textAlign: "center",
              border: `1px solid ${COLORS.accent}33`,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 50 }}>🌌</span>
            <h3 style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: 700, margin: "12px 0 8px" }}>
              Visualización guiada
            </h3>
            <p style={{ color: COLORS.textSecondary, fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
              Cierra los ojos. Imagínate en el lugar más hermoso y seguro que puedas concebir. Sientes paz, amor y plenitud. Esa es tu realidad manifestada.
            </p>
            {/* TODO: Reproducir audio de meditación */}
            <button
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              🎵 Reproducir guía
            </button>
          </div>

          {[
            { titulo: "Mañana de abundancia", duracion: "10 min", emoji: "☀️" },
            { titulo: "Tu yo ideal", duracion: "15 min", emoji: "✨" },
            { titulo: "Amor propio profundo", duracion: "12 min", emoji: "💗" },
            { titulo: "Manifestación nocturna", duracion: "8 min", emoji: "🌙" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 14 }}>{s.titulo}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12 }}>⏱ {s.duracion}</div>
              </div>
              <span style={{ color: COLORS.accent, fontSize: 20 }}>▶</span>
            </div>
          ))}
        </div>
      )}

      {modoActivo === "afirma" && (
        <div style={{ padding: "0 20px" }}>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
            Repite estas afirmaciones con convicción 💫
          </p>
          {AFIRMACIONES.map((a, i) => (
            <div
              key={i}
              style={{
                background: i % 2 === 0
                  ? `${COLORS.accent}11`
                  : `${COLORS.accentSecondary}11`,
                border: `1px solid ${i % 2 === 0 ? COLORS.accent + "33" : COLORS.accentSecondary + "33"}`,
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: COLORS.accentGold, fontSize: 16, flexShrink: 0 }}>✦</span>
              <p style={{ color: COLORS.textPrimary, fontSize: 14, margin: 0, lineHeight: 1.4 }}>{a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PantallaMetas() {
  const [metas, setMetas] = useState(METAS_VISION);

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ padding: "56px 20px 20px" }}>
        <h1 style={{ color: COLORS.textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Tablero de visión 🎯
        </h1>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, margin: 0 }}>
          Tu mapa hacia el yo soñado
        </p>
      </div>

      {/* Estadística general */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentSecondary}11)`,
            border: `1px solid ${COLORS.accent}33`,
            borderRadius: 16,
            padding: 16,
            textAlign: "center",
          }}
        >
          <p style={{ color: COLORS.textMuted, fontSize: 12, margin: "0 0 4px" }}>PROGRESO GENERAL</p>
          <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.accent }}>
            {Math.round(metas.reduce((a, m) => a + m.progreso, 0) / metas.length)}%
          </div>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: "4px 0 0" }}>
            hacia tu yo soñado ✨
          </p>
        </div>
      </div>

      {/* Metas */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {metas.map((meta) => (
          <div
            key={meta.id}
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 18,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 26 }}>{meta.emoji}</span>
              <div style={{ position: "relative" }}>
                <ProgressCircle value={meta.progreso} size={44} color={meta.color} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: meta.color, fontSize: 9, fontWeight: 700 }}>{meta.progreso}%</span>
                </div>
              </div>
            </div>
            <div>
              <div style={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 13 }}>{meta.titulo}</div>
              <BarraProgreso valor={meta.progreso} color={meta.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Agregar meta */}
      <div style={{ padding: "16px 20px 0" }}>
        {/* TODO: Modal para crear nuevas metas personalizadas */}
        <button
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accentSecondary}22)`,
            border: `2px dashed ${COLORS.accent}44`,
            borderRadius: 16,
            padding: "14px",
            color: COLORS.accent,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Agregar nueva meta
        </button>
      </div>

      {/* Subir imagen */}
      <div style={{ padding: "12px 20px 0" }}>
        {/* TODO: Permitir subir imágenes al tablero de visión */}
        <button
          style={{
            width: "100%",
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: "14px",
            color: COLORS.textSecondary,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span>🖼️</span> Subir imagen inspiracional
        </button>
      </div>
    </div>
  );
}

function PantallaPerfil() {
  const [notis, setNotis] = useState(true);
  const [tema, setTema] = useState("oscuro");

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ padding: "56px 20px 20px", textAlign: "center" }}>
        {/* TODO: Foto de perfil del usuario */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentTertiary})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 40,
          }}
        >
          🌸
        </div>
        {/* TODO: Nombre real del usuario */}
        <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
          Alma en Manifestación
        </h2>
        <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: "0 0 4px" }}>
          Comenzó su viaje hace 30 días
        </p>
        <span
          style={{
            background: `${COLORS.accentGold}22`,
            color: COLORS.accentGold,
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 99,
            fontWeight: 700,
          }}
        >
          🔥 Racha de 7 días
        </span>
      </div>

      {/* Estadísticas */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { valor: "30", label: "Días activa", emoji: "📅" },
            { valor: "84", label: "Hábitos", emoji: "✅" },
            { valor: "12", label: "Notas", emoji: "📓" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 14,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22 }}>{s.emoji}</div>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 20 }}>{s.valor}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración */}
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
          CONFIGURACIÓN
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Notificaciones */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span style={{ color: COLORS.textPrimary, fontSize: 14 }}>Recordatorios diarios</span>
            </div>
            <div
              onClick={() => setNotis(!notis)}
              style={{
                width: 46,
                height: 26,
                borderRadius: 99,
                background: notis
                  ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentSecondary})`
                  : COLORS.border,
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: notis ? 23 : 3,
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>

          {/* Opciones de menú */}
          {[
            { icon: "🌙", label: "Modo oscuro", action: null },
            { icon: "📊", label: "Ver mi progreso completo", action: null },
            { icon: "💜", label: "Compartir Mira Aya", action: null },
            { icon: "⭐", label: "Calificar la app", action: null },
            { icon: "📩", label: "Contacto y soporte", action: null },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bgCardLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.bgCard)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ color: COLORS.textPrimary, fontSize: 14 }}>{item.label}</span>
              </div>
              <span style={{ color: COLORS.textMuted, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>

        {/* Versión */}
        <p style={{ color: COLORS.textMuted, fontSize: 11, textAlign: "center", marginTop: 20 }}>
          {/* TODO: Versión real de la app */}
          Mira Aya v1.0 · Manifiesta tu yo soñado ✨
        </p>
      </div>
    </div>
  );
}

// ======================== APP PRINCIPAL ========================

export default function App() {
  const [tab, setTab] = useState("inicio");

  const tabs = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { id: "habitos", label: "Hábitos", icon: "✅" },
    { id: "diario", label: "Diario", icon: "📓" },
    { id: "meditacion", label: "Meditar", icon: "🧘" },
    { id: "metas", label: "Metas", icon: "🎯" },
    { id: "perfil", label: "Perfil", icon: "🌸" },
  ];

  const renderTab = () => {
    switch (tab) {
      case "inicio": return <PantallaInicio setTab={setTab} />;
      case "habitos": return <PantallaHabitos />;
      case "diario": return <PantallaDiario />;
      case "meditacion": return <PantallaVisualizacion />;
      case "metas": return <PantallaMetas />;
      case "perfil": return <PantallaPerfil />;
      default: return <PantallaInicio setTab={setTab} />;
    }
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Fondo con partículas */}
      <Particulas />

      {/* Contenido */}
      <div style={{ position: "relative", zIndex: 1, overflowY: "auto", minHeight: "100vh" }}>
        {renderTab()}
      </div>

      {/* Navbar inferior */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: `${COLORS.bgCard}EE`,
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${COLORS.border}`,
          display: "flex",
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "10px 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              position: "relative",
            }}
          >
            {tab === t.id && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 30,
                  height: 2,
                  background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}
            <span
              style={{
                fontSize: 20,
                filter: tab === t.id ? "none" : "grayscale(60%) opacity(0.6)",
                transition: "filter 0.2s",
              }}
            >
              {t.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                color: tab === t.id ? COLORS.accent : COLORS.textMuted,
                fontWeight: tab === t.id ? 700 : 400,
                transition: "color 0.2s",
              }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}