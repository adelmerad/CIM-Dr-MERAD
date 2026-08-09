document.addEventListener('DOMContentLoaded', function () {

  var isAr = document.documentElement.lang === 'ar';

  var L = isAr ? {
    moreOpen: 'اقرأ المزيد',
    moreClose: 'عرض أقل',
    errorName: 'يرجى إدخال اسمكم.',
    errorPhone: 'يرجى إدخال رقم هاتف صحيح.',
    waGreeting: 'مرحبًا، أرغب في حجز موعد.',
    waName: 'الاسم: ',
    waPhone: 'الهاتف: ',
    waService: 'الخدمة المطلوبة: ',
    waDateLabel: 'التاريخ المطلوب: ',
    waAt: ' الساعة ',
    waTimeLabel: 'الوقت المطلوب: ',
    waMessage: 'رسالة: ',
    formSent: 'شكرًا! تم إرسال طلبكم بنجاح. يُرجى الانتظار، سنردّ عليكم في أقرب وقت.'
  } : {
    moreOpen: 'En savoir plus',
    moreClose: 'Voir moins',
    errorName: 'Veuillez indiquer votre nom.',
    errorPhone: 'Veuillez indiquer un numéro de téléphone valide.',
    waGreeting: 'Bonjour, je souhaite prendre rendez-vous.',
    waName: 'Nom : ',
    waPhone: 'Téléphone : ',
    waService: 'Service souhaité : ',
    waDateLabel: 'Date souhaitée : ',
    waAt: ' à ',
    waTimeLabel: 'Heure souhaitée : ',
    waMessage: 'Message : ',
    formSent: 'Merci ! Votre demande a bien été envoyée. Patientez, nous vous répondrons dans les plus brefs délais.'
  };

  /* Menu burger */
  var burgerBtn = document.getElementById('burgerBtn');
  var navLinks = document.getElementById('navLinks');

  burgerBtn.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('active');
    burgerBtn.classList.toggle('active', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Accordéon "En savoir plus" des prestations */
  var moreToggles = document.querySelectorAll('.service-more-toggle');

  function updateMoreToggleLabel(btn) {
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.querySelector('.service-more-toggle-text').textContent = isOpen ? L.moreClose : L.moreOpen;
  }

  moreToggles.forEach(function (btn) {
    updateMoreToggleLabel(btn);
    btn.addEventListener('click', function () {
      var isOpen = btn.closest('.service-card').classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
      updateMoreToggleLabel(btn);
    });
  });

  /* Accordéon FAQ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* Fade-in on scroll */
  var fadeEls = document.querySelectorAll('.fade-in');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });

  /* Demande de rendez-vous → WhatsApp */
  var form = document.getElementById('contactForm');

  if (form) {
    var fields = {
      name: {
        input: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: function (value) {
          return value.trim().length > 0 ? '' : L.errorName;
        }
      },
      phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: function (value) {
          var pattern = /^[0-9+\s-]{8,}$/;
          return pattern.test(value.trim()) ? '' : L.errorPhone;
        }
      }
    };

    function setFieldError(field, message) {
      var group = field.input.closest('.form-group');
      field.error.textContent = message;
      if (message) {
        field.error.classList.add('visible');
        group.classList.add('has-error');
      } else {
        field.error.classList.remove('visible');
        group.classList.remove('has-error');
      }
    }

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      field.input.addEventListener('input', function () {
        setFieldError(field, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        var errorMessage = field.validate(field.input.value);
        setFieldError(field, errorMessage);
        if (errorMessage) isValid = false;
      });

      if (!isValid) return;

      var name = fields.name.input.value.trim();
      var phone = fields.phone.input.value.trim();
      var service = document.getElementById('service').value;
      var apptDate = document.getElementById('apptDate').value;
      var apptTime = document.getElementById('apptTime').value;
      var message = document.getElementById('message').value.trim();

      var lines = [
        L.waGreeting,
        L.waName + name,
        L.waPhone + phone
      ];
      if (service) lines.push(L.waService + service);
      if (apptDate) {
        var d = apptDate.split('-');
        var dateLabel = L.waDateLabel + d[2] + '/' + d[1] + '/' + d[0];
        if (apptTime) dateLabel += L.waAt + apptTime;
        lines.push(dateLabel);
      } else if (apptTime) {
        lines.push(L.waTimeLabel + apptTime);
      }
      if (message) lines.push(L.waMessage + message);

      var whatsappUrl = 'https://wa.me/213552055077?text=' + encodeURIComponent(lines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener');

      var sentMsg = document.getElementById('formSentMsg');
      if (!sentMsg) {
        sentMsg = document.createElement('div');
        sentMsg.id = 'formSentMsg';
        sentMsg.className = 'form-sent';
        sentMsg.setAttribute('role', 'status');
        sentMsg.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
        form.appendChild(sentMsg);
      }
      sentMsg.querySelector('span').textContent = L.formSent;
      sentMsg.classList.add('visible');
    });
  }

  /* Bouton retour en haut */
  var backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Assistant virtuel (chatbot FAQ) ===== */
  (function initChatbot() {
    var waNumber = '213552055077';
    var telNumber = '+21321002273';
    var mapsUrl = 'https://maps.app.goo.gl/9mdvxAoMeNicj3Vy7';
    var base = isAr ? '../' : '';

    var waPath = 'M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.478L4 29l7.72-1.85A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm0 21.6c-1.99 0-3.85-.57-5.42-1.56l-.39-.24-4.58 1.1 1.12-4.46-.25-.4A9.57 9.57 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6zm5.27-7.18c-.29-.14-1.7-.84-1.96-.93-.26-.1-.46-.14-.65.14-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.17 3 .14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.32.19 1.82.11.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.24.17-1.37-.07-.12-.26-.19-.55-.34z';
    var waSvg = '<svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="' + waPath + '"/></svg>';
    var chatSvg = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
    var closeSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';

    var waLink = 'https://wa.me/' + waNumber;
    var telLink = 'tel:' + telNumber;
    var phoneDisplay = '021 00 22 73';
    var waDisplay = '05 52 05 50 77';

    var C = isAr ? {
      launcherAria: 'فتح مساعد المركز',
      closeAria: 'إغلاق',
      title: 'مساعد CIM',
      subtitle: 'متصل · ردود فورية',
      footerBtn: 'التحدث إلى مستشار عبر واتساب',
      waMsgGeneric: 'مرحبًا، لدي سؤال.',
      waMsgRdv: 'مرحبًا، أرغب في حجز موعد.',
      welcome: 'مرحبًا 👋 أنا مساعد مركز <strong>الدكتور مراد</strong> للأشعة. كيف يمكنني مساعدتكم؟',
      nodes: {
        menu: { bot: 'كيف يمكنني مساعدتكم؟ 🙂', replies: [
          { label: '📅 حجز موعد', to: 'rdv' },
          { label: '🕐 أوقات العمل', to: 'horaires' },
          { label: '📍 العنوان والوصول', to: 'adresse' },
          { label: '🩺 فحوصاتنا', to: 'examens' },
          { label: '📋 التحضير والوثائق', to: 'preparation' },
          { label: '📞 اتصلوا بنا', to: 'contact' }
        ] },
        rdv: { bot: 'لحجز موعد، أخبرونا بالفحص المطلوب وأوقات توفركم:<br>• واتساب: <a href="' + waLink + '" target="_blank" rel="noopener">' + waDisplay + '</a> (الأسرع)<br>• الهاتف: <a href="' + telLink + '">' + phoneDisplay + '</a><br>• أو عبر استمارة طلب الموعد أسفل الموقع.', replies: [
          { label: '💬 المراسلة عبر واتساب', act: 'wa', msg: 'rdv' },
          { label: '🕐 أوقات العمل', to: 'horaires' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] },
        horaires: { bot: 'نستقبلكم <strong>من السبت إلى الخميس، من الساعة 8:30 إلى 16:30</strong>.<br>مغلق يوم الجمعة.', replies: [
          { label: '📅 حجز موعد', to: 'rdv' },
          { label: '📍 العنوان والوصول', to: 'adresse' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] },
        adresse: { bot: 'طريق عدشة رقم 3، خلف مسجد بلال بن رباح، مقابل 150 مسكن — <strong>بئر توتة، الجزائر</strong>.', replies: [
          { label: '🗺️ فتح في خرائط جوجل', act: 'maps' },
          { label: '🕐 أوقات العمل', to: 'horaires' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] },
        examens: { bot: 'نقوم بالفحوصات التالية:<br>• سكانير 64 شريحة (القولون / الأوعية / الأمعاء)<br>• تصوير بالصدى ودوبلر<br>• أشعة رقمية<br>• ماموغرافيا<br>• بانوراما الأسنان<br>• خزعة وبزل موجّهان', replies: [
          { label: '📋 التحضير والوثائق', to: 'preparation' },
          { label: '📅 حجز موعد', to: 'rdv' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] },
        preparation: { bot: 'يعتمد التحضير على نوع الفحص (الصيام، امتلاء المثانة، الحقن…): نوضح لكم كل شيء عند حجز الموعد.<br><br><strong>ما يجب إحضاره يوم الفحص:</strong><br>• الوصفة الطبية / طلب الفحص<br>• فحوصاتكم السابقة (إن وُجدت)<br>• بطاقة الهوية', replies: [
          { label: '💬 طرح سؤال عبر واتساب', act: 'wa', msg: 'generic' },
          { label: '📅 حجز موعد', to: 'rdv' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] },
        contact: { bot: 'يمكنكم التواصل معنا عبر:<br>• الهاتف: <a href="' + telLink + '">' + phoneDisplay + '</a><br>• واتساب: <a href="' + waLink + '" target="_blank" rel="noopener">' + waDisplay + '</a><br>• البريد: <a href="mailto:cimmerad@gmail.com">cimmerad@gmail.com</a>', replies: [
          { label: '💬 واتساب', act: 'wa', msg: 'generic' },
          { label: '📞 اتصال', act: 'tel' },
          { label: '↩︎ القائمة', to: 'menu' }
        ] }
      }
    } : {
      launcherAria: 'Ouvrir l’assistant du centre',
      closeAria: 'Fermer',
      title: 'Assistant CIM',
      subtitle: 'En ligne · réponses immédiates',
      footerBtn: 'Parler à un conseiller sur WhatsApp',
      waMsgGeneric: 'Bonjour, j’ai une question.',
      waMsgRdv: 'Bonjour, je souhaite prendre rendez-vous.',
      welcome: 'Bonjour 👋 Je suis l’assistant du centre <strong>CIM Dr MERAD</strong>. Comment puis-je vous aider ?',
      nodes: {
        menu: { bot: 'Que puis-je faire pour vous ? 🙂', replies: [
          { label: '📅 Prendre rendez-vous', to: 'rdv' },
          { label: '🕐 Horaires d’ouverture', to: 'horaires' },
          { label: '📍 Adresse & accès', to: 'adresse' },
          { label: '🩺 Nos examens', to: 'examens' },
          { label: '📋 Préparation & documents', to: 'preparation' },
          { label: '📞 Nous contacter', to: 'contact' }
        ] },
        rdv: { bot: 'Pour prendre rendez-vous, indiquez-nous l’examen souhaité et vos disponibilités :<br>• WhatsApp : <a href="' + waLink + '" target="_blank" rel="noopener">' + waDisplay + '</a> (le plus rapide)<br>• Téléphone : <a href="' + telLink + '">' + phoneDisplay + '</a><br>• Ou le formulaire de RDV plus bas sur le site.', replies: [
          { label: '💬 Écrire sur WhatsApp', act: 'wa', msg: 'rdv' },
          { label: '🕐 Vos horaires', to: 'horaires' },
          { label: '↩︎ Menu', to: 'menu' }
        ] },
        horaires: { bot: 'Nous sommes ouverts <strong>du samedi au jeudi, de 8h30 à 16h30</strong>.<br>Fermé le vendredi.', replies: [
          { label: '📅 Prendre rendez-vous', to: 'rdv' },
          { label: '📍 Adresse & accès', to: 'adresse' },
          { label: '↩︎ Menu', to: 'menu' }
        ] },
        adresse: { bot: 'Route Adedcha N°3, derrière la Mosquée Bilel ibn Rabah, en face les 150 logements — <strong>Birtouta, Alger</strong>.', replies: [
          { label: '🗺️ Ouvrir dans Google Maps', act: 'maps' },
          { label: '🕐 Horaires', to: 'horaires' },
          { label: '↩︎ Menu', to: 'menu' }
        ] },
        examens: { bot: 'Nous réalisons :<br>• Scanner 64 coupes (colo / angio / entéro-scanner)<br>• Échographie & Écho-doppler<br>• Radiologie numérisée<br>• Mammographie<br>• Panoramique dentaire<br>• Ponction & biopsie guidées', replies: [
          { label: '📋 Préparation & documents', to: 'preparation' },
          { label: '📅 Prendre rendez-vous', to: 'rdv' },
          { label: '↩︎ Menu', to: 'menu' }
        ] },
        preparation: { bot: 'La préparation dépend de l’examen (à jeun, vessie pleine, injection…) : nous vous précisons tout à la prise de rendez-vous.<br><br><strong>À apporter le jour de l’examen :</strong><br>• Votre ordonnance / demande d’examen<br>• Vos examens antérieurs (si vous en avez)<br>• Une pièce d’identité', replies: [
          { label: '💬 Poser une question sur WhatsApp', act: 'wa', msg: 'generic' },
          { label: '📅 Prendre rendez-vous', to: 'rdv' },
          { label: '↩︎ Menu', to: 'menu' }
        ] },
        contact: { bot: 'Vous pouvez nous joindre :<br>• Téléphone : <a href="' + telLink + '">' + phoneDisplay + '</a><br>• WhatsApp : <a href="' + waLink + '" target="_blank" rel="noopener">' + waDisplay + '</a><br>• Email : <a href="mailto:cimmerad@gmail.com">cimmerad@gmail.com</a>', replies: [
          { label: '💬 WhatsApp', act: 'wa', msg: 'generic' },
          { label: '📞 Appeler', act: 'tel' },
          { label: '↩︎ Menu', to: 'menu' }
        ] }
      }
    };

    /* Construction du widget */
    var launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'chat-launcher';
    launcher.setAttribute('aria-label', C.launcherAria);
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.innerHTML =
      '<span class="chat-ic chat-ic-open">' + chatSvg + '</span>' +
      '<span class="chat-ic chat-ic-close">' + closeSvg + '</span>' +
      '<span class="chat-launcher-dot" aria-hidden="true"></span>';

    var panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', C.title);
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="chat-header">' +
        '<span class="chat-avatar"><img src="' + base + 'assets/logo.png" alt="" width="40" height="40"></span>' +
        '<span class="chat-header-text"><strong>' + C.title + '</strong><small>' + C.subtitle + '</small></span>' +
        '<button type="button" class="chat-close" aria-label="' + C.closeAria + '">&times;</button>' +
      '</div>' +
      '<div class="chat-body"></div>' +
      '<div class="chat-footer"><a class="chat-wa-btn" href="' + waLink + '" target="_blank" rel="noopener">' + waSvg + '<span>' + C.footerBtn + '</span></a></div>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var body = panel.querySelector('.chat-body');
    var isOpen = false;
    var started = false;

    function scrollBottom() { body.scrollTop = body.scrollHeight; }

    function addBot(html) {
      var row = document.createElement('div');
      row.className = 'chat-msg chat-msg-bot';
      row.innerHTML = html;
      body.appendChild(row);
      scrollBottom();
    }

    function addUser(text) {
      var row = document.createElement('div');
      row.className = 'chat-msg chat-msg-user';
      row.textContent = text;
      body.appendChild(row);
      scrollBottom();
    }

    function clearReplies() {
      var ex = body.querySelector('.chat-replies');
      if (ex) ex.parentNode.removeChild(ex);
    }

    function addReplies(replies) {
      clearReplies();
      var wrap = document.createElement('div');
      wrap.className = 'chat-replies';
      replies.forEach(function (r) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chat-reply';
        b.textContent = r.label;
        b.addEventListener('click', function () { handleReply(r); });
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      scrollBottom();
    }

    function showTyping(after) {
      var typing = document.createElement('div');
      typing.className = 'chat-msg chat-msg-bot chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      scrollBottom();
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        after();
      }, 450);
    }

    function goTo(id) {
      var node = C.nodes[id];
      if (!node) return;
      showTyping(function () {
        if (node.bot) addBot(node.bot);
        addReplies(node.replies);
      });
    }

    function keepRepliesLast() {
      var rep = body.querySelector('.chat-replies');
      if (rep) body.appendChild(rep);
      scrollBottom();
    }

    function handleReply(r) {
      if (r.to) {
        clearReplies();
        addUser(r.label);
        goTo(r.to);
      } else if (r.act === 'wa') {
        addUser(r.label);
        var msg = r.msg === 'rdv' ? C.waMsgRdv : C.waMsgGeneric;
        window.open(waLink + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        keepRepliesLast();
      } else if (r.act === 'tel') {
        addUser(r.label);
        window.location.href = telLink;
        keepRepliesLast();
      } else if (r.act === 'maps') {
        addUser(r.label);
        window.open(mapsUrl, '_blank', 'noopener');
        keepRepliesLast();
      }
    }

    function startConversation() {
      started = true;
      showTyping(function () {
        addBot(C.welcome);
        addReplies(C.nodes.menu.replies);
      });
    }

    function openChat() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      launcher.classList.add('active', 'seen');
      launcher.setAttribute('aria-expanded', 'true');
      isOpen = true;
      if (!started) startConversation();
      panel.querySelector('.chat-close').focus();
    }

    function closeChat() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      launcher.classList.remove('active');
      launcher.setAttribute('aria-expanded', 'false');
      isOpen = false;
      launcher.focus();
    }

    launcher.addEventListener('click', function () {
      if (isOpen) closeChat(); else openChat();
    });
    panel.querySelector('.chat-close').addEventListener('click', closeChat);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  })();

});
