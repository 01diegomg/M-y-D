/* ================================================================
   CONFIGURACION FACIL - TODOS LOS TEXTOS EN UN SOLO LUGAR

   Aqui puedes cambiar TODOS los textos de la pagina sin buscar
   en diferentes archivos. Solo edita los valores entre comillas.

   CARPETAS DE RECURSOS:
   - /fotos/    -> Pon aqui tus fotos
   - /musica/   -> Pon aqui tus canciones (.mp3)
   - /videos/   -> Pon aqui tus videos (.mp4)
   ================================================================ */

const CONFIG = {

    // ============================================================
    // INFORMACION BASICA
    // ============================================================

    tituloPagina: "Siempre amaré a esta personita!!!",
    tituloNavegador: "Para el amor de mi vida... Cintya Melany Martinez Avila",

    // ============================================================
    // FECHA DE ANIVERSARIO
    // Formato: 'YYYY-MM-DD' (Anio-Mes-Dia)
    // ============================================================

    fechaAniversario: '2023-09-01',
    tituloContador: "Tiempo siendo pulgas aventureras",
    mensajeAniversario: "Es muy poco tiempo, contigo quiero estar esta vida y lo que siga después de ella!!!",

    // ============================================================
    // CARTA DE AMOR
    // ============================================================

    carta: {
        tituloSeccion: "Una Carta Para: MI NIÑA PRECIOSA",
        instruccion: "Haz click en el sobre para abrirlo...",
        encabezado: "Mi chocolatita bella",
        subtitulo: "De Diego Martínez Gayosso, con todo el amor de mi corazón",
        contenido: `Siendo un recuerdo, esta carta te quiero decir unas palabras...

Hoy en día siendo novios para mí es un placer y me siento muy afortunado de tenerte en mi vida, como siempre te lo he dicho tenemos bajas y altas pero sin duda alguna ME HACES EL HOMBRE MÁS FELIZ DEL MUNDO.
Te debo demasiado, mi felicidad no tiene precio y yo amándote y siendo agradecido contigo quiera verte muy feliz y al igual que la mía verte feliz no tiene precio y me causa felicidad verte feliz conmigo aunque sea un rato.

Hoy en día estoy muy enamorado de ti y sé que lo sabes pero algo sí te voy a decir, tú siempre serás el amor de mi vida, te lo juro que jamás podré no amarte, te has vuelto una persona muy especial para mí siendo un grupo selecto estas personas las cuales son familiares y tú ahora y siempre.

Hoy en día sigo luchando por hacerte muy feliz, eres canijilla y a veces se me hace difícil pero amor no me voy a rendir, todas las personas en este mundo valen la pena pero yo quiero luchar por ti y por que te quedes en mi vida una eternidad y más.

Si algún día muero espero verte aunque sea de lejitos después, es que simplemente eres esa persona por la cual daría hasta mi vida por un abrazo y un beso, yo me muero de amor por ti.

Perdóname por todo el daño causado y por el daño que te llegará a causar, no merezco cada lágrima tuya, pero debes de saber que nadie en el mundo te amará como yo y luchará por ser mejor hombre por el simple hecho de ya no verte llorar por él.

De verdad que TE AMO MUCHO MI NIÑA BONITA... Quisiera que comprendieras que lo hago con toda mi alma y que esto que siento es amor verdadero, amor (amor eterno).

Eres mi luna y yo soy tu sol, somos y siempre seremos pareja perfecta.`,
        firma: "MI CORAZÓN SIEMPRE SERÁ TUYO GORDITA"
    },

    // ============================================================
    // TARJETA PRINCIPAL CON CORAZON
    // ============================================================

    tarjetaPrincipal: {
        textoSuperior: "Cada día a tu lado es especial, y quiero recordarte lo mucho que significas para mí...",
        textoInferior: "Hice esta página pa que veas que te amo chula y porque eres la persona más especial de mi vida.",
        textoContadorClicks: "Púchale en mi corazón de pollo",
        botonSorpresa: "Click aquí para una sorpresa"
    },

    // ============================================================
    // RAZONES POR LAS QUE TE AMO
    // Puedes agregar o quitar razones
    // ============================================================

    razones: {
        titulo: "Algunas de las muchas razones por las que te amo frijolito",
        lista: [
            "Ver esos ojitos viéndome enojada me hace feliz",
            "Tus pedos huelen rico",
            "Me haces muy feliz",
            "Estás bien preciosa y dica",
            "Tu forma de ser me gusta mucho",
            "Pus por que pinches me gustas y me como hasta tu kk preciosa jejeje"
        ]
    },

    // ============================================================
    // MENSAJES AL HACER CLICK EN EL CORAZON
    // Puedes agregar mas niveles: { clicks: mensaje }
    // ============================================================

    mensajesClicks: {
        10: "10 clicks! Aguas amor es mi corazón pícale con cariño",
        50: "50 clicks! Si le sigues picando te voy a dar tus besotes por grosera",
        100: "100 CLICKS! A poco sí muy verguitas amor!",
        200: "200 clicks! Órale pues necia sígele picando y ve lo que pasa!",
        500: "500 CLICKS! Me debes unos becerros con garrón de pilín!"
    },

    // ============================================================
    // VIDEO DE RECUERDOS
    // Pon tus videos en la carpeta /videos/
    // Formatos soportados: .mp4, .webm, .ogg
    // ============================================================

    video: {
        tituloSeccion: "Amo todo tipo de recuerdo que me dejas Pimpolla",
        // Lista de videos - puedes agregar más
        videos: [
            {
                titulo: "Especial",
                subtitulo: "Recuerdo que nos gusta a los dos",
                archivo: "video1.mp4"
            },
            {
                titulo: "Joyita de video",
                subtitulo: "Soy tremendo mi amor jejej",
                archivo: "video2.mp4"
            },
            {
                titulo: "El baby",
                subtitulo: "En un futuro muy cercano preciosa, ya lo verás",
                archivo: "video3.mp4"
            },
            {
                titulo: "Buena Navidad",
                subtitulo: "Esta navidad me gustó mucho por ti",
                archivo: "video4.mp4"
            },
            {
                titulo: "Super Especial",
                subtitulo: "Claro que yo sí lo iba a guardar mi amor",
                archivo: "video5.mp4"
            },
            {
                titulo: "Soy feliz contigo",
                subtitulo: "Amo besarte",
                archivo: "video6.mp4"
            },
            {
                titulo: "Misma navidad",
                subtitulo: "Haciendo un arbolito con mi bb",
                archivo: "video7.mp4"
            }
        ],
        // Texto alternativo si no hay video
        mensajeSinVideo: "Pronto agregaremos nuestro video especial aquí",
        // Mostrar controles del video
        mostrarControles: true,
        // Reproducir automáticamente (sin sonido)
        autoplay: false,
        // Reproducir en loop
        loop: true
    },

    // ============================================================
    // GALERIA DE FOTOS (DESDE CARPETA LOCAL)
    // Pon tus fotos en la carpeta /fotos/
    // Solo cambia el nombre del archivo y la descripcion
    // Formatos soportados: .jpg, .jpeg, .png, .gif, .webp
    // ============================================================

    galeria: {
        titulo: "Nuestros Momentos Especiales",
        subtitulo: "Cada foto guarda un recuerdo de nuestro amor",
        // Lista de fotos - archivo: nombre del archivo en /fotos/
        // La galeria muestra 6 fotos por pagina con flechas para navegar
        fotos: [
            // Página 1
            { archivo: "foto1.jpeg", caption: "Guapetones animados" },
            { archivo: "foto2.jpeg", caption: "Patoaventura" },
            { archivo: "foto3.jpeg", caption: "Nunca me ganaré uno jajaj" },
            { archivo: "foto4.jpeg", caption: "Adivina quiénes se casaron?" },
            { archivo: "foto5.jpeg", caption: "Dicen que hasta nos parecemos jejej" },
            { archivo: "foto6.jpeg", caption: "Bonito recuerdo de mi cumpleaños" },
            // Página 2
            { archivo: "foto7.jpeg", caption: "Sin barbita" },
            { archivo: "foto8.jpeg", caption: "De hecho TE AMO MUCHO" },
            { archivo: "foto9.jpeg", caption: "A que ni te acuerdas que navidad fue!!!" },
            { archivo: "foto10.jpeg", caption: "Te digo que nos dicen que nos parecemos jajaajaj" },
            { archivo: "foto11.jpeg", caption: "Con ojos de amor" },
            { archivo: "foto12.jpeg", caption: "Que preciosa!!!" },
            // Página 3
            { archivo: "foto13.jpeg", caption: "Hasta momentos con mi suegra caray!! jeje" },
            { archivo: "foto14.jpeg", caption: "Chulitos" },
            { archivo: "foto15.jpeg", caption: "MI ING HERMOSA" },
            { archivo: "foto16.jpeg", caption: "Esta foto siempre la recordaré" },
            { archivo: "foto17.jpeg", caption: "Más momentos en familia jejej" },
            { archivo: "foto18.jpeg", caption: "TE AMO DEMASIADO FRIJOLITO!!!!" }
        ]
    },

    // ============================================================
    // REPRODUCTOR DE MUSICA (DESDE CARPETA LOCAL)
    // Pon tus canciones en la carpeta /musica/
    // Formatos soportados: .mp3, .ogg, .wav
    // ============================================================

    musica: {
        titulo: "Nuestra Playlist",
        // Lista de canciones - archivo: nombre del archivo en /musica/
        canciones: [
            { archivo: "cancion1.mp3", titulo: "Nuestra Canción", artista: "Artista 1" },
            { archivo: "cancion2.mp3", titulo: "Dedicatoria <3", artista: "Artista 2" },
            { archivo: "cancion3.mp3", titulo: "Una que me recuerda a ti", artista: "Artista 3" },
            { archivo: "cancion4.mp3", titulo: "Dedicación tuya", artista: "Artista 4" },
            { archivo: "cancion5.mp3", titulo: "Si soy, perdón", artista: "Artista 5" },
            { archivo: "cancion6.mp3", titulo: "Me imagino contigo con...", artista: "Artista 6" }
        ],
        // Reproducir automaticamente al cargar
        autoplay: false,
        // Repetir playlist
        loop: true,
        // Mezclar canciones aleatoriamente
        shuffle: false
    },

    // ============================================================
    // MEMORAMA
    // ============================================================

    memorama: {
        titulo: "Memorama del Amor",
        instruccion: "Encuentra todas las parejas y gana puntos! Acumula puntos para ganar premios!",
        emojis: ['&#128149;', '&#128150;', '&#128151;', '&#128147;', '&#128157;', '&#128152;', '&#10084;', '&#128159;'],
        mensajePremio: "Has ganado un premio canjeable en persona!",
        botonNuevoJuego: "Nuevo Juego",
        // Sistema de puntos
        puntosBase: 100, // Puntos base por completar
        bonusPorIntento: 10, // Puntos extra si completas con pocos intentos
        maxIntentosBono: 12, // Máximo de intentos para obtener el bono completo
        // Tabla de premios por puntos acumulados
        premiosPorPuntos: [
            { puntos: 100, emoji: '&#127851;', premio: 'Un chocolate para ti!' },
            { puntos: 250, emoji: '&#127836;', premio: 'Una maruchan con chetos!' },
            { puntos: 500, emoji: '&#128144;', premio: 'Una flor por chula!' },
            { puntos: 750, emoji: '&#127853;', premio: 'Un chupamatracas para ti!' },
            { puntos: 1000, emoji: '&#127909;', premio: 'Te llevo al cine!' },
            { puntos: 1500, emoji: '&#127873;', premio: 'Una sorpresa especial!' },
            { puntos: 2000, emoji: '&#127801;', premio: 'Una cita romántica!' },
            { puntos: 3000, emoji: '&#127775;', premio: 'Un regalo muy especial que siempre has querido!' }
        ]
    },

    // ============================================================
    // RULETA DEL AMOR
    // ============================================================

    ruleta: {
        titulo: "Púchale y ve tu suerte",
        instruccion: "Hay castigos pero premios bb!, una vez cada 5 días amor",
        botonGirar: "Girar Ruleta!",
        premios: [
            { emoji: '&#128536;', premio: 'Me toca escoger la cita!' },
            { emoji: '&#129303;', premio: 'Te toca escoger la cita!' },
            { emoji: '&#127853;', premio: 'Un chupamatracas para mi!' },
            { emoji: '&#127851;', premio: 'Un chocolate para ti!' },
            { emoji: '&#127909;', premio: 'Te llevo al cine!' },
            { emoji: '&#127836;', premio: 'Invítame una maruchan y unos chetos!' },
            { emoji: '&#128144;', premio: 'Te debo una flor por chula !' },
            { emoji: '&#128140;', premio: 'Vamos al MP!' }
        ]
    },

    // ============================================================
    // MENSAJE FINAL
    // ============================================================

    mensajeFinal: {
        texto: "Gracias por compartir conmigo parte de tu vida porque al hacer eso alegraste la mía.",
        despedida: "TE AMARÉ PARA SIEMPRE FRIJOLITO"
    },

    // ============================================================
    // EASTER EGGS Y SECRETOS (configuracion)
    // ============================================================

    secretos: {
        // Código Konami: arriba, arriba, abajo, abajo, izq, der, izq, der, B, A
        konamiActivo: true,
        mensajeKonami: "Desbloqueaste el modo super amor! Te amo con todo mi corazón!",

        // Triple click en el título
        tripleClickTitulo: true,
        mensajeTripleClick: "Descubriste un secreto! Eres increíble!",

        // Mantener presionado el corazón 3 segundos
        corazonSecreto: true,
        mensajeCorazonSecreto: "Si me tratas con cariño te haré la mujer más feliz del mundo!",

        // Click secreto en la esquina superior izquierda
        esquinaSecreta: true,
        mensajeEsquina: "Tómale cap y te debo un deseo muy grande!"
    }
};

// No modificar esta linea - exporta la configuracion
if (typeof module !== 'undefined') module.exports = CONFIG;
