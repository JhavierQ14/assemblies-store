// 1. Número par o impar
let num = prompt("Ingrese un número:");
if (num !== null) {
  num = Number(num);
  if (!isNaN(num)) {
    alert(num % 2 === 0 ? "El número es par" : "El número es impar");
  }
}

// 2. Días del mes
let mes = prompt("Ingrese un mes (1-12):");
if (mes !== null) {
  mes = Number(mes);
  let dias = 0;
  if ([1,3,5,7,8,10,12].includes(mes)) dias = 31;
  else if ([4,6,9,11].includes(mes)) dias = 30;
  else if (mes === 2) dias = 28;
  if (dias) alert("El mes tiene " + dias + " días");
}

// 3. Examen aprobado
let nota = prompt("Ingrese la nota del examen:");
if (nota !== null) {
  nota = Number(nota);
  if (!isNaN(nota)) {
    if (nota > 7) alert("Examen aprobado");
    else if (nota > 4) alert("Debe recuperar");
    else alert("Aplazo");
  }
}

// 4. Grupo de letras
let letra = prompt("Ingrese una letra:").toLowerCase();
if (letra) {
  let grupo = "";
  if ("aeiou".includes(letra)) grupo = "A";
  else if ("bcdfg".includes(letra)) grupo = "B";
  else if ("hjklm".includes(letra)) grupo = "C";
  else if ("npqr".includes(letra)) grupo = "D";
  else if ("stvwyxz".includes(letra)) grupo = "E";
  if (grupo) alert("La letra pertenece al grupo " + grupo);
}

// 5. Piedra, papel o tijera con rondas
let rondas = prompt("¿Cuántas rondas quieres jugar?");
if (rondas !== null) {
  rondas = Number(rondas);
  let opciones = ["Piedra", "Papel", "Tijera"];
  let puntajeU = 0, puntajeC = 0;
  for (let i = 1; i <= rondas; i++) {
    let jugadaU = prompt("Ronda " + i + " de " + rondas + "\nElige: Piedra, Papel o Tijera").toLowerCase();
    let jugadaC = opciones[Math.floor(Math.random()*3)].toLowerCase();
    let resultado = "";
    if (jugadaU === jugadaC) resultado = "Empate";
    else if (
      (jugadaU === "piedra" && jugadaC === "tijera") ||
      (jugadaU === "papel" && jugadaC === "piedra") ||
      (jugadaU === "tijera" && jugadaC === "papel")
    ) {
      resultado = "Has ganado esta ronda";
      puntajeU++;
    } else if (["piedra","papel","tijera"].includes(jugadaU)) {
      resultado = "Computadora ha ganado esta ronda";
      puntajeC++;
    } else {
      resultado = "Jugada inválida";
    }
    alert(
      "Ronda: " + i + " de " + rondas +
      "\nTú: " + jugadaU +
      "\nComputadora: " + jugadaC +
      "\n" + resultado +
      "\nPuntaje: " + puntajeU + " (Tú) - " + puntajeC + " (Computadora)" +
      "\nRondas restantes: " + (rondas - i)
    );
  }
  let final = puntajeU > puntajeC ? "¡Ganaste el juego!" : puntajeU < puntajeC ? "La computadora ganó el juego" : "Empate final";}