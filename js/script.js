document.addEventListener('DOMContentLoaded', function () {

  /* Bascule FR / AR */
  var currentLang = localStorage.getItem('cimLang') || 'fr';
  var langToggle = document.getElementById('langToggle');

  function t(key, frFallback) {
    return (currentLang === 'ar' && window.AR_TRANSLATIONS && window.AR_TRANSLATIONS[key]) || frFallback;
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-fr-text')) el.setAttribute('data-fr-text', el.textContent);
      var frText = el.getAttribute('data-fr-text');
      el.textContent = (lang === 'ar' && AR_TRANSLATIONS[key]) ? AR_TRANSLATIONS[key] : frText;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (!el.hasAttribute('data-fr-placeholder')) el.setAttribute('data-fr-placeholder', el.getAttribute('placeholder') || '');
      var frText = el.getAttribute('data-fr-placeholder');
      el.setAttribute('placeholder', (lang === 'ar' && AR_TRANSLATIONS[key]) ? AR_TRANSLATIONS[key] : frText);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (!el.hasAttribute('data-fr-aria')) el.setAttribute('data-fr-aria', el.getAttribute('aria-label') || '');
      var frText = el.getAttribute('data-fr-aria');
      el.setAttribute('aria-label', (lang === 'ar' && AR_TRANSLATIONS[key]) ? AR_TRANSLATIONS[key] : frText);
    });

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (langToggle) langToggle.textContent = lang === 'ar' ? 'FR' : 'عربي';

    currentLang = lang;
    localStorage.setItem('cimLang', lang);
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyTranslations(currentLang === 'ar' ? 'fr' : 'ar');
    });
  }

  applyTranslations(currentLang);

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
    btn.querySelector('.service-more-toggle-text').textContent = isOpen
      ? t('js.moreClose', 'Voir moins')
      : t('js.moreOpen', 'En savoir plus');
  }

  moreToggles.forEach(function (btn) {
    updateMoreToggleLabel(btn);
    btn.addEventListener('click', function () {
      var isOpen = btn.closest('.service-card').classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
      updateMoreToggleLabel(btn);
    });
  });

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      moreToggles.forEach(updateMoreToggleLabel);
    });
  }

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
          return value.trim().length > 0 ? '' : t('js.errorName', 'Veuillez indiquer votre nom.');
        }
      },
      phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: function (value) {
          var pattern = /^[0-9+\s-]{8,}$/;
          return pattern.test(value.trim()) ? '' : t('js.errorPhone', 'Veuillez indiquer un numéro de téléphone valide.');
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
        t('wa.greeting', 'Bonjour, je souhaite prendre rendez-vous.'),
        t('wa.name', 'Nom : ') + name,
        t('wa.phone', 'Téléphone : ') + phone
      ];
      if (service) lines.push(t('wa.service', 'Service souhaité : ') + service);
      if (apptDate) {
        var d = apptDate.split('-');
        var dateLabel = t('wa.dateLabel', 'Date souhaitée : ') + d[2] + '/' + d[1] + '/' + d[0];
        if (apptTime) dateLabel += t('wa.at', ' à ') + apptTime;
        lines.push(dateLabel);
      } else if (apptTime) {
        lines.push(t('wa.timeLabel', 'Heure souhaitée : ') + apptTime);
      }
      if (message) lines.push(t('wa.message', 'Message : ') + message);

      var whatsappUrl = 'https://wa.me/213552055077?text=' + encodeURIComponent(lines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

});
