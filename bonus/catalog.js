// Catálogo de bonus. El entrenador elige en la Ficha (🎁 Bonus) cuáles tiene cada cliente.
// doc: página que se lee dentro de la app (bonus/<id>.html) y se descarga en PDF (bonus/pdf/<id>.pdf).
// link: bonus que es un documento externo o una sección de la app. videos: pega el enlace de YouTube (oculto) en «yt».
window.BONUS=[
  {id:'kit',t:'Kit de Arranque',s:'Tus primeros 14 días',ic:'🚀',main:1,doc:1,
    d:'Qué va a pasar las dos primeras semanas, cómo pesar (también lo ya cocinado) y las dudas que tiene todo el mundo al empezar.',
    videos:[{t:'Lo que va a pasar tus primeras 2 semanas',yt:'https://youtu.be/3ya87N-8hSo'},{t:'Crudo o cocinado: cómo pesar sin volverte loco',yt:'https://youtube.com/shorts/E83Bxf_YwuA'},{t:'Me he saltado el plan: ¿y ahora qué?',yt:'https://youtube.com/shorts/ZKs48e5i1Fo'}]},
  {id:'finde',t:'Fin de Semana Sin Culpa',s:'Sal, cena y disfruta sin romper la semana',ic:'🍻',main:1,doc:0,d:'Cómo salir, cenar fuera y tomarte algo sin tirar la semana, y qué hacer el lunes.',videos:[]},
  {id:'libertad',t:'Libertad de por Vida',s:'Mantener sin plan y sin rebote',ic:'🗝️',main:1,doc:0,d:'Cómo pasar del plan a comer a ojo, mantener tu peso y qué hacer si sube.',videos:[]},
  {id:'casa',t:'Protocolo Fuerte en Casa',s:'Entrena en casa con lo que tengas',ic:'🏠',doc:0,d:'Rutinas con tu cuerpo, gomas o mancuernas, más snacks de movimiento.',videos:[]},
  {id:'viaje',t:'Protocolo de Viaje',s:'Mantener cuando viajas',ic:'✈️',doc:0,d:'Entrenos express, snacks de movimiento y cómo comer en hotel, apartamento y fuera.',videos:[]},
  {id:'caotica',t:'Protocolo Semana Caótica',s:'Cuando la semana se tuerce',ic:'⚡',doc:0,d:'El mínimo que mantiene tu progreso: entreno corto, snacks de movimiento y regla del 70 %.',videos:[]},
  {id:'meal',t:'Cocina 1 Vez, Come Toda la Semana',s:'Meal prep en 90 minutos',ic:'🍱',doc:0,d:'Menús semanales con lista de la compra y orden de cocinado.',videos:[]},
  {id:'carta',t:'Carta de Restaurantes y Bares',s:'Qué pedir fuera de casa',ic:'🍽️',link:'https://drive.google.com/file/d/1MXfIbHVysfkzJxs7SZblMfunqmpVv3ax/view',d:'Elige bien en cualquier restaurante o bar.',videos:[]},
  {id:'cadenas',t:'Guía de Cadenas',s:'McDonald\'s, Burger King, Telepizza, sushi…',ic:'🍔',doc:0,d:'La mejor opción en cada cadena y cómo pedirla.',videos:[]},
  {id:'atracon',t:'Protocolo Antiatracón',s:'Cuando el hambre o la ansiedad aprietan',ic:'🧯',doc:0,d:'Prevenir, qué hacer en el momento y las 24 horas siguientes, sin castigos.',videos:[]},
  {id:'turnos',t:'Protocolo Turnos y Noches',s:'Comer y entrenar a turnos',ic:'🌙',doc:0,d:'Reparto de comidas, entreno y sueño según tu turno.',videos:[]},
  {id:'descanso',t:'Protocolo Descanso y Estrés',s:'Dormir mejor y bajar revoluciones',ic:'😴',doc:0,d:'Rutina de sueño y técnicas de 5 minutos para el estrés.',videos:[]},
  {id:'recetario',t:'Recetario Yaronska',s:'Más de 1.000 recetas con tus cantidades',ic:'📖',app:'recetas',d:'Todas las recetas ajustadas a tu plan, en Comidas › Recetas.',videos:[]},
  {id:'emergencia',t:'Videollamada de Emergencia',s:'1 por fase, cuando la necesites',ic:'🆘',app:'sos',d:'Una llamada extra de 20 minutos para una recaída, un viaje o un mes malo. Pídela por WhatsApp.',videos:[]}
];
