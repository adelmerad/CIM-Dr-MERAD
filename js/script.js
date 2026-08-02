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
    waMessage: 'رسالة: '
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
    waMessage: 'Message : '
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

});
