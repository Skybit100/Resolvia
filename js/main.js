/* ==========================================================================
   RESOLVIA — main.js
   JavaScript vanilla, sin dependencias. Todo es mejora progresiva:
   sin JS el sitio se lee completo y los enlaces funcionan.

   Índice
   0. Configuración
   1. HEADER: estado al hacer scroll
   2. HEADER: menú móvil accesible
   3. Navegación activa por sección
   4. Animaciones de entrada
   5. PROCESS: indicador de avance
   6. CTA: aparición secuencial
   7. WHATSAPP: enlaces y botón flotante
   8. CONTACT: formulario
   9. Año del footer
   ========================================================================== */

(() => {
  "use strict";

  /* ========================================================================
     0. Configuración
     Datos de contacto en un solo lugar. Todo lo que está aquí es público.
     ======================================================================== */
  const CONFIG = {
    whatsappNumber: "525533101723",
    whatsappMessage: "Hola, contacto a RESOLVIA porque necesito ayuda con un proyecto.",
    email: "contacto@resolvia.com.mx",
    // URL del servicio de formularios (ej. "https://formspree.io/f/abcdwxyz").
    // Si se deja vacía, se usa el atributo data-endpoint del <form>.
    formEndpoint: ""
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ========================================================================
     1. HEADER: estado al hacer scroll
     ======================================================================== */
  const header = $("[data-header]");

  if (header && !header.classList.contains("site-header--static")) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  /* ========================================================================
     2. HEADER: menú móvil accesible
     ======================================================================== */
  const menuToggle = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");

  if (menuToggle && mobileMenu) {
    const label = $(".visually-hidden", menuToggle);
    const focusables = () => $$("a, button", mobileMenu);

    const openMenu = () => {
      mobileMenu.hidden = false;
      menuToggle.setAttribute("aria-expanded", "true");
      label.textContent = "Cerrar menú";
      header.classList.add("menu-open");
      document.body.classList.add("is-locked");
      const first = focusables()[0];
      if (first) first.focus();
    };

    const closeMenu = (returnFocus = true) => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      label.textContent = "Abrir menú";
      header.classList.remove("menu-open");
      document.body.classList.remove("is-locked");
      if (returnFocus) menuToggle.focus();
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    // Al elegir un enlace, cerrar y dejar que el ancla haga su trabajo
    mobileMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (mobileMenu.hidden) return;

      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      // Mantener el foco dentro del menú (botón + enlaces)
      if (event.key === "Tab") {
        const items = [menuToggle, ...focusables()];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Si la pantalla crece a escritorio con el menú abierto, cerrarlo
    window.matchMedia("(min-width: 1200px)").addEventListener("change", (mq) => {
      if (mq.matches && !mobileMenu.hidden) closeMenu(false);
    });
  }

  /* ========================================================================
     3. Navegación activa por sección
     ======================================================================== */
  const navLinks = $$(".site-nav__link");

  if (navLinks.length && "IntersectionObserver" in window) {
    const sections = navLinks
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ========================================================================
     4. Animaciones de entrada
     Escalonado ligero entre elementos hermanos.
     ======================================================================== */
  const revealItems = $$("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealItems.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 80}ms`);
      revealObserver.observe(el);
    });
  }

  /* ========================================================================
     5. PROCESS: indicador de avance
     La línea se llena conforme cada etapa entra en pantalla.
     ======================================================================== */
  const timeline = $("[data-timeline]");

  if (timeline) {
    const steps = $$("[data-step]", timeline);
    const total = steps.length;

    const setProgress = (count) => {
      // En horizontal la línea llega al nodo; con 1 etapa ya se ve avance
      const value = total > 1 ? (count - 1) / (total - 1) : 1;
      timeline.style.setProperty("--progress", Math.max(0, value).toFixed(3));
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      steps.forEach((s) => s.classList.add("is-active"));
      setProgress(total);
    } else {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-active");
        });
        // Las etapas se activan en orden: contar las consecutivas desde la 01
        let count = 0;
        for (const s of steps) {
          if (!s.classList.contains("is-active")) break;
          count += 1;
        }
        // Si el usuario llegó directo al final, completar las anteriores
        const lastActive = steps.map((s) => s.classList.contains("is-active")).lastIndexOf(true);
        if (lastActive + 1 > count) {
          steps.slice(0, lastActive + 1).forEach((s) => s.classList.add("is-active"));
          count = lastActive + 1;
        }
        setProgress(count);
      }, { rootMargin: "0px 0px -30% 0px", threshold: 0.6 });

      steps.forEach((s) => stepObserver.observe(s));
    }
  }

  /* ========================================================================
     6. CTA: aparición secuencial
     ======================================================================== */
  const cta = $("[data-cta]");

  if (cta) {
    const needs = $$(".cta__needs li", cta);
    const showAll = () => {
      needs.forEach((li) => li.classList.add("is-in"));
      cta.classList.add("is-done");
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      showAll();
    } else {
      const ctaObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        needs.forEach((li, i) => {
          window.setTimeout(() => li.classList.add("is-in"), 250 + i * 380);
        });
        window.setTimeout(() => cta.classList.add("is-done"), 250 + needs.length * 380 + 200);
      }, { threshold: 0.35 });
      ctaObserver.observe(cta);
    }
  }

  /* ========================================================================
     7. WHATSAPP: enlaces y botón flotante
     Nunca se abre WhatsApp automáticamente: solo al hacer clic.
     ======================================================================== */
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  $$("[data-whatsapp]").forEach((link) => { link.href = waUrl; });

  const waFloat = $("[data-wa-float]");
  const contactSection = $("#contacto");
  const heroSection = $("#inicio");

  if (waFloat && "IntersectionObserver" in window) {
    // Ocultar en el hero (ya hay CTA visibles) y en contacto (datos a la vista)
    const visible = new Map();
    const updateFloat = () => {
      const hide = [...visible.values()].some(Boolean);
      waFloat.classList.toggle("is-hidden", hide);
    };
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
      updateFloat();
    }, { threshold: 0.15 });
    [heroSection, contactSection].filter(Boolean).forEach((s) => floatObserver.observe(s));
  }

  /* ========================================================================
     8. CONTACT: formulario
     - Con endpoint (Formspree u otro): envío real vía fetch.
     - Sin endpoint: abre el correo del visitante con el mensaje redactado.
       No se simula un envío que no ocurre.
     ======================================================================== */
  const form = $("[data-contact-form]");

  if (form) {
    const status = $("[data-form-status]", form);
    const submitBtn = $("[data-submit]", form);
    const hint = $("#f-contact-hint", form);
    const endpoint = (CONFIG.formEndpoint || form.dataset.endpoint || "").trim();

    const setStatus = (message, type = "") => {
      status.textContent = message;
      status.classList.remove("is-error", "is-success");
      if (type) status.classList.add(`is-${type}`);
    };

    const markInvalid = (field, invalid) => {
      if (invalid) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    };

    const validate = () => {
      const nombre = form.elements.nombre;
      const mensaje = form.elements.mensaje;
      const telefono = form.elements.telefono;
      const correo = form.elements.correo;
      const privacidad = form.elements.privacidad;
      const errors = [];

      markInvalid(nombre, !nombre.value.trim());
      if (!nombre.value.trim()) errors.push(nombre);

      const hasPhone = telefono.value.replace(/\D/g, "").length >= 8;
      const hasEmail = correo.value.trim() !== "" && correo.checkValidity();
      const contactOk = hasPhone || hasEmail;
      markInvalid(telefono, !contactOk);
      markInvalid(correo, !contactOk || (correo.value.trim() !== "" && !correo.checkValidity()));
      hint.classList.toggle("is-error", !contactOk);
      if (!contactOk) errors.push(telefono);

      markInvalid(mensaje, !mensaje.value.trim());
      if (!mensaje.value.trim()) errors.push(mensaje);

      markInvalid(privacidad, !privacidad.checked);
      if (!privacidad.checked) errors.push(privacidad);

      return errors;
    };

    const composeBody = (data) => [
      `Nombre: ${data.get("nombre")}`,
      `Empresa / organización: ${data.get("empresa") || "-"}`,
      `Teléfono: ${data.get("telefono") || "-"}`,
      `Correo: ${data.get("correo") || "-"}`,
      `Tipo de necesidad: ${data.get("tipo") || "-"}`,
      `Ubicación: ${data.get("ubicacion") || "-"}`,
      "",
      "¿Qué necesito resolver?",
      data.get("mensaje")
    ].join("\n");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const errors = validate();
      if (errors.length) {
        setStatus("Revisa los campos marcados para poder responderte.", "error");
        errors[0].focus();
        return;
      }

      const data = new FormData(form);
      if (data.get("_gotcha")) return; // bot

      // Sin servicio conectado: abrir el correo con el mensaje listo
      if (!endpoint) {
        const subject = `Contacto desde el sitio · ${data.get("nombre")}`;
        const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeBody(data))}`;
        window.location.href = mailto;
        setStatus("Abrimos tu aplicación de correo con el mensaje listo. Si no se abrió, escríbenos por WhatsApp o a " + CONFIG.email + ".");
        return;
      }

      // Envío real al servicio externo
      submitBtn.disabled = true;
      setStatus("Enviando…");
      data.delete("privacidad");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        setStatus("Gracias. Recibimos tu mensaje y te responderemos a la brevedad.", "success");
      } catch (error) {
        setStatus("No pudimos enviar el mensaje. Escríbenos por WhatsApp o a " + CONFIG.email + ".", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });

    // Limpiar el estado de error al corregir
    form.addEventListener("input", (event) => {
      if (event.target.getAttribute("aria-invalid") === "true") validate();
    });
    form.addEventListener("change", (event) => {
      if (event.target.type === "checkbox" && event.target.getAttribute("aria-invalid") === "true") validate();
    });
  }

  /* ========================================================================
     9. Año del footer
     ======================================================================== */
  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
