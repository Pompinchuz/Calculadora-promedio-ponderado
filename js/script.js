let contadorMaterias = 0;

function agregarMateria() {
  contadorMaterias++;
  const mostrarNombres = document.getElementById("toggle-nombres").checked;

  const container = document.getElementById("materias-container");

  const div = document.createElement("div");
  div.className = "col-12 col-md-6 col-lg-4";
  div.innerHTML = `
    <div class="card materia" data-id="${contadorMaterias}">
      <div class="card-header text-center">
        <h5>Materia ${contadorMaterias}</h5>
      </div>
      <div class="card-body d-flex flex-column align-items-center">
        <input type="text" placeholder="Nombre de la materia (opcional)" class="nombre form-control mb-2" style="max-width: 300px; ${mostrarNombres ? '' : 'display: none;'}" >
        <div class="d-flex gap-3 mb-2 justify-content-center">
          <input type="number" placeholder="Nota" class="nota form-control border-2 border-primary" style="width: 120px;" required onblur="validateInput(this, 'Nota')">
          <input type="number" placeholder="Créditos" class="creditos form-control border-2 border-primary" style="width: 120px;" required onblur="validateInput(this, 'Créditos')">
        </div>
        <button class="btn btn-danger mt-auto" onclick="eliminarMateria(${contadorMaterias})">Eliminar</button>
      </div>
    </div>
  `;
  container.appendChild(div);
}

function validateInput(el, field) {
  const value = parseFloat(el.value);
  if (el.value !== '' && (isNaN(value) || value < 0)) {
    const materia = el.closest('.materia');
    const id = materia.getAttribute('data-id');
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${field} inválido en materia #${id}. Debe ser un número mayor o igual a cero.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    el.classList.add('is-invalid');
    el.focus();
  } else {
    el.classList.remove('is-invalid');
  }
}

function eliminarMateria(id) {
  const container = document.getElementById("materias-container");
  const materiaWrapper = container.querySelector(`.materia[data-id='${id}']`).parentNode;
  if (materiaWrapper) {
    container.removeChild(materiaWrapper);
    renumberMaterias();
  }
}

function renumberMaterias() {
  const container = document.getElementById("materias-container");
  const materiaWrappers = container.querySelectorAll(".col-12.col-md-6.col-lg-4");
  for (let i = 0; i < materiaWrappers.length; i++) {
    const newId = i + 1;
    const materia = materiaWrappers[i].querySelector(".materia");
    materia.setAttribute("data-id", newId);
    const h5 = materia.querySelector("h5");
    h5.innerText = `Materia ${newId}`;
    const btn = materia.querySelector(".btn-danger");
    btn.setAttribute("onclick", `eliminarMateria(${newId})`);
  }
  contadorMaterias = materiaWrappers.length;
}

function mostrarOcultarNombres(mostrar) {
  const nombres = document.querySelectorAll(".nombre");
  nombres.forEach(nombre => {
    nombre.style.display = mostrar ? "block" : "none";
  });
}

function calcularPromedio() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = '';
  document.getElementById("resultado").innerText = '';

  const materias = document.querySelectorAll(".materia");

  let sumaProductos = 0;
  let sumaCreditos = 0;

  for (let i = 0; i < materias.length; i++) {
    const nota = parseFloat(materias[i].querySelector(".nota").value);
    const creditos = parseFloat(materias[i].querySelector(".creditos").value);

    if (isNaN(nota) || isNaN(creditos) || nota < 0 || creditos < 0) {
      errorMessage.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Verifica que los valores sean positivos en la materia #${i + 1}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      return;
    }

    sumaProductos += nota * creditos;
    sumaCreditos += creditos;
  }

  const promedio = sumaCreditos > 0 ? (sumaProductos / sumaCreditos).toFixed(2) : 0;
  document.getElementById("resultado").innerText = `🎓 Tu promedio ponderado es: ${promedio}`;
}


window.onload = () => {
  const mostrarNombres = document.getElementById("toggle-nombres").checked;
  for (let i = 0; i < 3; i++) {
    agregarMateria();
  }
  mostrarOcultarNombres(mostrarNombres);
};