document.addEventListener('DOMContentLoaded', function () {

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
          return value.trim().length > 0 ? '' : 'Veuillez indiquer votre nom.';
        }
      },
      phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: function (value) {
          var pattern = /^[0-9+\s-]{8,}$/;
          return pattern.test(value.trim()) ? '' : 'Veuillez indiquer un numéro de téléphone valide.';
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
        'Bonjour, je souhaite prendre rendez-vous.',
        'Nom : ' + name,
        'Téléphone : ' + phone
      ];
      if (service) lines.push('Service souhaité : ' + service);
      if (apptDate) {
        var d = apptDate.split('-');
        var dateLabel = 'Date souhaitée : ' + d[2] + '/' + d[1] + '/' + d[0];
        if (apptTime) dateLabel += ' à ' + apptTime;
        lines.push(dateLabel);
      } else if (apptTime) {
        lines.push('Heure souhaitée : ' + apptTime);
      }
      if (message) lines.push('Message : ' + message);

      var whatsappUrl = 'https://wa.me/213552055077?text=' + encodeURIComponent(lines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

});
