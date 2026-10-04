import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

import {
  Mic,
  ArrowRight,
  ChevronRight,
  Command,
  Activity,
  Database,
  Cpu,
  Globe,
  Rocket,
  FolderOpen,
  Sparkles,
  Terminal,
  Volume2,
  Send,
  X
} from "lucide-react";

import "./style.css";


/* =========================================================
   3D BIZLY CORE
========================================================= */

function ParticleField() {
  const ref = React.useRef();

  const positions = React.useMemo(() => {
    const arr = new Float32Array(1800 * 3);

    for (let i = 0; i < 1800; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
      ref.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#78bfff"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}


function OrbitalRing({ radius, rotation, speed }) {
  const ref = React.useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += speed;
    }
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.008, 8, 160]} />
      <meshBasicMaterial
        color="#68baff"
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}


function BizlyCore({ active }) {
  const group = React.useRef();

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y =
      state.clock.elapsedTime * 0.12;

    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
  });

  return (
    <group ref={group}>

      <Float
        speed={1.2}
        rotationIntensity={0.15}
        floatIntensity={0.35}
      >

        <mesh>
          <sphereGeometry args={[1.45, 64, 64]} />

          <meshPhysicalMaterial
            color="#071528"
            emissive="#0a3c72"
            emissiveIntensity={active ? 2.5 : 1.3}
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.96}
          />
        </mesh>

        <mesh scale={1.01}>
          <sphereGeometry args={[1.47, 48, 48]} />

          <meshBasicMaterial
            color="#6ebcff"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>

        <mesh scale={1.12}>
          <sphereGeometry args={[1.6, 32, 32]} />

          <meshBasicMaterial
            color="#4ca8ff"
            wireframe
            transparent
            opacity={0.07}
          />
        </mesh>

      </Float>

      <OrbitalRing
        radius={2}
        rotation={[Math.PI / 2.5, 0.2, 0]}
        speed={0.004}
      />

      <OrbitalRing
        radius={2.3}
        rotation={[1.1, 0.5, 0]}
        speed={-0.0025}
      />

      <OrbitalRing
        radius={2.7}
        rotation={[0.2, 1, 0]}
        speed={0.0018}
      />

      <ParticleField />

      <pointLight
        position={[0, 0, 0]}
        intensity={active ? 12 : 7}
        distance={6}
        color="#3da9ff"
      />

    </group>
  );
}


function CoreScene({ active }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 45
      }}
      dpr={[1, 1.7]}
    >

      <ambientLight intensity={0.25} />

      <BizlyCore active={active} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
      />

    </Canvas>
  );
}


/* =========================================================
   UI COMPONENTS
========================================================= */

function HUDPanel({ children, className = "" }) {
  return (
    <div className={`hud-panel ${className}`}>
      {children}
    </div>
  );
}


function StatusDot() {
  return <span className="status-dot" />;
}


/* =========================================================
   MAIN APPLICATION
========================================================= */

export default function App() {

  const [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [section, setSection] = useState("HOME");
  const [designs, setDesigns] = useState([]);
  const [sources, setSources] = useState([]);
  const [error, setError] = useState("");

  const submitPrompt = async () => {
  if (!prompt.trim()) return;

  setProcessing(true);
  setError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/rag/generate-three-designs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: prompt,
          provider: "jan"
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    setDesigns(data.designs || []);
    setSources(data.sourcesUsed || []);

    console.log("BIZLY RAG RESPONSE:", data);

    setSection("PREVIEW");

  } catch (err) {
    console.error("BIZLY BACKEND ERROR:", err);
    setError(err.message || "Failed to connect to BIZLY backend.");
  } finally {
    setProcessing(false);
  }
};

  

  const toggleVoice = () => {

    setListening(true);

    setTimeout(() => {
      setListening(false);
    }, 3500);
  };


  useEffect(() => {

    const keyHandler = (e) => {

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }

      if (e.key === "Escape") {
        setCommandOpen(false);
      }

    };

    window.addEventListener("keydown", keyHandler);

    return () =>
      window.removeEventListener("keydown", keyHandler);

  }, []);


  const commands = [
    {
      icon: Sparkles,
      title: "Generate Website",
      action: () => {
        setSection("GENERATE");
        setCommandOpen(false);
      }
    },
    {
      icon: Database,
      title: "Knowledge",
      action: () => {
        setSection("KNOWLEDGE");
        setCommandOpen(false);
      }
    },
    {
      icon: Cpu,
      title: "Models",
      action: () => {
        setSection("MODELS");
        setCommandOpen(false);
      }
    },
    {
      icon: Globe,
      title: "Preview",
      action: () => {
        setSection("PREVIEW");
        setCommandOpen(false);
      }
    },
    {
      icon: Rocket,
      title: "Deploy",
      action: () => {
        setSection("DEPLOY");
        setCommandOpen(false);
      }
    },
    {
      icon: FolderOpen,
      title: "Saved Projects",
      action: () => {
        setSection("PROJECTS");
        setCommandOpen(false);
      }
    }
  ];


  return (

    <div className="app">

      {/* =================================================
          ATMOSPHERE
      ================================================= */}

      <div className="noise" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />


      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-symbol">
            B
          </div>

          <div>
            <div className="brand-name">
              BIZLY
            </div>

            <div className="brand-sub">
              AI WEBSITE SYSTEM
            </div>
          </div>

        </div>


        <div className="system-id">
          <span />
          BM // SYSTEM 01
        </div>


        <nav>

          {[
            "HOME",
            "KNOWLEDGE",
            "MODELS",
            "PROJECTS",
            "DEPLOY"
          ].map((item) => (

            <button
              key={item}
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
            >
              {item}
            </button>

          ))}

        </nav>


        <div className="system-status">

          <StatusDot />

          <span>ONLINE</span>

          <div className="clock">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </div>

        </div>

      </header>


      {/* =================================================
          LEFT COMMAND PANEL
      ================================================= */}

      <aside className="left-panel">

        <HUDPanel>

          <div className="panel-heading">

            <span>
              COMMANDS
            </span>

            <Command size={14} />

          </div>

          <div className="command-list">

            <button onClick={() => setSection("GENERATE")}>
              <ChevronRight />
              Generate Website
            </button>

            <button onClick={() => setSection("KNOWLEDGE")}>
              <ChevronRight />
              Knowledge
            </button>

            <button onClick={() => setSection("MODELS")}>
              <ChevronRight />
              Models
            </button>

            <button onClick={() => setSection("PREVIEW")}>
              <ChevronRight />
              Preview
            </button>

            <button onClick={() => setSection("DEPLOY")}>
              <ChevronRight />
              Deploy
            </button>

            <button onClick={() => setSection("PROJECTS")}>
              <ChevronRight />
              Saved projects
            </button>

          </div>


          <button
            className={`voice-command ${listening ? "listening" : ""}`}
            onClick={toggleVoice}
          >

            <Mic size={15} />

            {listening
              ? "Listening..."
              : "Voice command"
            }

          </button>

        </HUDPanel>


        <div className="vertical-label">
          CREATIVE INTELLIGENCE SYSTEM
        </div>

      </aside>


      {/* =================================================
          RIGHT SYSTEM PANEL
      ================================================= */}

      <aside className="right-panel">

        <HUDPanel>

          <div className="small-label">
            CURRENT SYSTEM
          </div>

          <div className="system-title">
            BIZLY CORE
          </div>


          <div className="mini-core">

            <div className="mini-orb">
              B
            </div>

          </div>


          <div className="status-list">

            <div>
              <span>CORE</span>
              <strong>ONLINE</strong>
            </div>

            <div>
              <span>AI</span>
              <strong>READY</strong>
            </div>

            <div>
              <span>RAG</span>
              <strong>CONNECTED</strong>
            </div>

            <div>
              <span>VOICE</span>
              <strong>
                {listening ? "ACTIVE" : "READY"}
              </strong>
            </div>

            <div>
              <span>NETWORK</span>
              <strong>STABLE</strong>
            </div>

          </div>

        </HUDPanel>


        <HUDPanel className="model-panel">

          <div className="small-label">
            ACTIVE MODEL
          </div>

          <div className="model-name">
            AI ROUTER
          </div>

          <div className="model-meta">
            OmniRoute / Backend
          </div>

          <div className="model-line">
            <StatusDot />
            CONNECTED
          </div>

        </HUDPanel>

      </aside>


      {/* =================================================
          MAIN HERO
      ================================================= */}

      <main className="main">

        <section className="hero">

          <div className="hero-copy">

            <div className="eyebrow">
              <span />
              CREATIVE INTELLIGENCE SYSTEM
            </div>

            <h1>
              BUILD
              <br />
              <span>WEBSITES</span>
              <br />
              THAT MOVE.
            </h1>

            <p>
              BIZLY is an intelligent website-generation
              system that researches, designs, builds,
              previews and deploys digital experiences.
            </p>


            <div className="hero-actions">

              <button
                className="primary-button"
                onClick={() => setSection("GENERATE")}
              >

                START BUILDING

                <ArrowRight size={17} />

              </button>


              <button
                className="secondary-button"
                onClick={() => setSection("PROJECTS")}
              >

                <FolderOpen size={16} />

                SAVED PROJECTS

              </button>

            </div>

          </div>


          {/* =================================================
              3D CORE
          ================================================= */}

          <div className="core-wrapper">

            <div className="core-status">

              <span>BIZLY CORE</span>

              <strong>
                {processing
                  ? "GENERATING..."
                  : listening
                    ? "LISTENING..."
                    : "ONLINE"
                }
              </strong>

            </div>


            <div className="core">

              <CoreScene
                active={processing || listening}
              />

            </div>


            <div className="core-platform">

              <div className="platform-ring ring-1" />
              <div className="platform-ring ring-2" />
              <div className="platform-ring ring-3" />

            </div>

          </div>


          {/* =================================================
              HERO SIDE INFORMATION
          ================================================= */}

          <div className="capability-panel">

            <div className="small-label">
              SYSTEM CAPABILITIES
            </div>

            <div className="capability-list">

              <span>RAG RESEARCH</span>
              <span>AI GENERATION</span>
              <span>PRD CREATION</span>
              <span>WEB DEVELOPMENT</span>
              <span>LIVE PREVIEW</span>
              <span>VERCEL DEPLOYMENT</span>

            </div>

          </div>

        </section>


        {/* =================================================
            COMMAND / PROMPT BAR
        ================================================= */}

        <section className="command-area">

          <div className="command-header">

            <div>
              <span className="status-dot" />
              BIZLY IS READY
            </div>

            <span>
              CTRL + K COMMANDS
            </span>

          </div>


          <div className="prompt-box">

            <Terminal size={18} />

            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitPrompt();
                }
              }}
              placeholder="Describe the website you want BIZLY to build..."
            />


            <button
              className={listening ? "active-mic" : ""}
              onClick={toggleVoice}
              title="Voice input"
            >

              <Mic size={19} />

            </button>


            <button
              className="send-button"
              onClick={submitPrompt}
            >

              <Send size={18} />

            </button>

          </div>


          <div className="prompt-hints">

            <span>
              Try:
            </span>

            <button
              onClick={() =>
                setPrompt(
                  "Build a premium cinematic website for a luxury AI company."
                )
              }
            >
              "Build a premium AI website"
            </button>

            <button
              onClick={() =>
                setPrompt(
                  "Make the website more futuristic and interactive."
                )
              }
            >
              "Make it more futuristic"
            </button>

            <button
              onClick={() =>
                setPrompt(
                  "Add a premium 3D hero section."
                )
              }
            >
              "Add a 3D hero"
            </button>

          </div>

        </section>


        {/* =================================================
            LOWER DASHBOARD
        ================================================= */}

        <section className="lower-grid">


          {/* KNOWLEDGE */}

          <HUDPanel>

            <div className="card-header">

              <div>
                <Database size={16} />
                KNOWLEDGE
              </div>

              <span>
                RAG
              </span>

            </div>


            <div className="big-number">
              1,284
            </div>

            <div className="metric-label">
              SOURCES INDEXED
            </div>


            <div className="progress">

              <div
                className="progress-fill"
                style={{ width: "78%" }}
              />

            </div>

            <div className="metric-footer">

              <span>
                Websites processed
              </span>

              <strong>
                78%
              </strong>

            </div>

          </HUDPanel>


          {/* MODELS */}

          <HUDPanel>

            <div className="card-header">

              <div>
                <Cpu size={16} />
                MODEL NETWORK
              </div>

              <span>
                API
              </span>

            </div>


            <div className="model-stack">

              <div className="model-row">

                <span>
                  PRIMARY
                </span>

                <strong>
                  AI ROUTER
                </strong>

                <StatusDot />

              </div>

              <div className="model-row">

                <span>
                  GENERATION
                </span>

                <strong>
                  CONNECTED
                </strong>

                <StatusDot />

              </div>

              <div className="model-row">

                <span>
                  RAG
                </span>

                <strong>
                  ACTIVE
                </strong>

                <StatusDot />

              </div>

            </div>

          </HUDPanel>


          {/* PROJECT */}

          <HUDPanel className="project-card">

            <div className="card-header">

              <div>
                <Activity size={16} />
                CURRENT BUILD
              </div>

              <span>
                LIVE
              </span>

            </div>


            <div className="project-title">
              YOUR NEXT WEBSITE
            </div>

            <div className="project-description">
              Generate a complete website,
              preview it and deploy it directly.
            </div>


            <button
              className="outline-button"
              onClick={() => setSection("PREVIEW")}
            >

              OPEN PREVIEW

              <ArrowRight size={15} />

            </button>

          </HUDPanel>


          {/* DEPLOY */}

          <HUDPanel>

            <div className="card-header">

              <div>
                <Rocket size={16} />
                DEPLOYMENT
              </div>

              <span>
                VERCEL
              </span>

            </div>


            <div className="deploy-status">

              <div className="deploy-icon">
                <Rocket size={20} />
              </div>

              <div>

                <strong>
                  READY TO DEPLOY
                </strong>

                <span>
                  Production environment connected
                </span>

              </div>

            </div>


            <button
              className="deploy-button"
              onClick={() => setSection("DEPLOY")}
            >

              DEPLOY WEBSITE

              <ArrowRight size={15} />

            </button>

          </HUDPanel>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer>

          <span>
            BIZLY // CREATIVE INTELLIGENCE SYSTEM
          </span>

          <span>
            BUILD • PREVIEW • DEPLOY
          </span>

          <span>
            2026
          </span>

        </footer>

      </main>


      {/* =================================================
          COMMAND MODAL
      ================================================= */}

      {commandOpen && (

        <div
          className="command-overlay"
          onClick={() => setCommandOpen(false)}
        >

          <div
            className="command-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-top">

              <span>
                BIZLY COMMAND CENTER
              </span>

              <button
                onClick={() => setCommandOpen(false)}
              >
                <X size={18} />
              </button>

            </div>


            <div className="command-modal-input">

              <Command size={18} />

              <input
                autoFocus
                placeholder="What do you want BIZLY to do?"
              />

            </div>


            <div className="modal-commands">

              {commands.map((command) => {

                const Icon = command.icon;

                return (

                  <button
                    key={command.title}
                    onClick={command.action}
                  >

                    <Icon size={17} />

                    <span>
                      {command.title}
                    </span>

                    <ChevronRight size={15} />

                  </button>

                );

              })}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
