import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Neuron {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = 2;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.pulse += this.pulseSpeed;
      }

      draw() {
        const pulseSize = Math.sin(this.pulse) * 2;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius + pulseSize + 1
        );
        gradient.addColorStop(0, "rgba(0, 212, 255, 0.1)");
        gradient.addColorStop(0.5, "rgba(150, 90, 255, 0.05)");
        gradient.addColorStop(1, "rgba(10, 14, 39, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulseSize + 10, 0, Math.PI * 2);
        ctx.fill();

        // Core neuron
        ctx.fillStyle = "#00d4ff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spot
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, this.radius / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const neurons = [];
    const neuronCount = 80;
    const maxDistance = 150;

    for (let i = 0; i < neuronCount; i++) {
      neurons.push(
        new Neuron(Math.random() * canvas.width, Math.random() * canvas.height)
      );
    }

    const drawConnection = (n1, n2, distance) => {
      const opacity = 1 - distance / maxDistance;

      const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
      gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.3})`);
      gradient.addColorStop(0.5, `rgba(123, 47, 247, ${opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(0, 212, 255, ${opacity * 0.3})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = opacity * 2;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const distance = Math.hypot(
            neurons[j].x - neurons[i].x,
            neurons[j].y - neurons[i].y
          );
          if (distance < maxDistance) drawConnection(neurons[i], neurons[j], distance);
        }
      }

      neurons.forEach((neuron) => {
        neuron.update();
        neuron.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse interaction
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      neurons.forEach((neuron) => {
        const distance = Math.hypot(mouseX - neuron.x, mouseY - neuron.y);
        if (distance < 100) {
          const angle = Math.atan2(mouseY - neuron.y, mouseX - neuron.x);
          neuron.vx -= Math.cos(angle) * 0.05;
          neuron.vy -= Math.sin(angle) * 0.05;
        }
      });
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleClick = () => {
    navigate("/about");
  };

  return (
    <header className="relative min-h-[60vh] md:min-h-screen h-auto flex items-center justify-center text-center overflow-hidden pt-28 md:pt-0">
      {/* Neural Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      ></canvas>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-6 py-12 md:py-0 max-w-4xl mx-auto">

        {/* Main Heading */}
        <h1
          data-aos="fade-down"
          className="font-extrabold tracking-wide text-2xl sm:text-4xl md:text-5xl 
                 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600
                 bg-clip-text text-transparent"
        >
          DRIVING THE FUTURE
        </h1>

        {/* Subheading */}
        <h2
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-2 md:mt-4 font-extrabold text-gray-800 text-lg sm:text-2xl md:text-3xl"
        >
          WHERE INNOVATION <br className="hidden md:block" /> MEETS AUTOMATION
        </h2>

        {/* Highlight */}
        <h1
          data-aos="zoom-in"
          data-aos-delay="400"
          className="mt-2 md:mt-3 font-[cursive] text-2xl sm:text-4xl md:text-5xl
                 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600
                 bg-clip-text text-transparent py-2"
        >
          Intelligent Automation
        </h1>

        {/* Underline */}
        <div
          data-aos="fade-right"
          data-aos-delay="600"
          className="w-24 sm:w-48 md:w-64 h-1 mt-2 md:mt-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
        ></div>

        {/* Paragraph */}
        <p
          data-aos="fade-up"
          data-aos-delay="700"
          className="mt-4 md:mt-6 max-w-xs sm:max-w-xl text-gray-700 font-semibold text-sm sm:text-base md:text-lg leading-relaxed hover:text-indigo-400 transition-colors duration-300"
        >
          Leveraging smart systems to streamline workflows, optimize efficiency
          and empower businesses to achieve more with technology.
        </p>

        {/* Button */}
        <button
          data-aos="zoom-in"
          data-aos-delay="1200"
          onClick={handleClick}
          className="mt-6 sm:mt-8 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 
                 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 
                 rounded-md cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105 shadow-md"
        >
          DISCOVER MORE
        </button>
      </div>
    </header>

  );
};

export default Banner;
