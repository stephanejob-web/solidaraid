/* ── Données des signalements ── */
const alertsData = {
  'alert-1': {
    icon:'👕', title:'Manteau + pantalon homme',
    desc:"Homme d'environ 40 ans, assis devant la pharmacie rue de la Paix. Il fait très froid ce soir, il n'a qu'un t-shirt. Taille L approximativement.",
    location:'Rue de la Paix, Paris 2e', distance:'320 m • 🚶 4 min à pied',
    category:'Vêtements', items:'Taille L', time:'Il y a 18 min',
    signaler:'Julien M.', signalerRating:'4.8', signalerAvatar:'J', signalerColor:'av-orange',
    urgency:'high', initialState:'other', takenByOther:'Sophie L.', takenByOtherEta:'en route',
    participants:[
      { name:'Sophie L.', avatar:'S', color:'av-blue', status:'En route — ~15 min' },
    ],
  },
  'alert-2': {
    icon:'🍞', title:'Repas chaud — famille avec enfants',
    desc:"Femme + 2 enfants en bas âge (3 et 6 ans), place du Châtelet. Elles n'ont pas mangé de la journée. Les enfants semblent épuisés et ont froid.",
    location:'Place du Châtelet, Paris 1er', distance:'650 m • 🚶 8 min à pied',
    category:'Nourriture', items:'Repas chaud complet', time:'Il y a 32 min',
    signaler:'Camille D.', signalerRating:'4.7', signalerAvatar:'C', signalerColor:'av-purple',
    urgency:'high', initialState:'open',
    participants:[
      { name:'Thomas R.', avatar:'T', color:'av-green', status:'Disponible' },
    ],
    groupMessages:[
      { name:'Camille D.', avatar:'C', color:'av-purple', text:"La famille est toujours place du Châtelet, côté fontaine. Les enfants ont l'air épuisés 😢", time:'14:05' },
      { name:'Thomas R.', avatar:'T', color:'av-green', text:"Je peux apporter des sandwichs et de l'eau, j'en route.", time:'14:08' },
    ],
  },
  'alert-3': {
    icon:'🧴', title:'Kit hygiène complet',
    desc:"Homme, ~30 ans, gare du Nord — savon, rasoir, dentifrice. Cherche du travail, tient à sa présentation. Aucune réponse depuis 1h.",
    location:'Gare du Nord, Paris 10e', distance:'1,2 km • 🚶 15 min à pied',
    category:'Hygiène', items:'Kit hygiène complet', time:'Il y a 1h05',
    signaler:'Camille R.', signalerRating:'4.6', signalerAvatar:'C', signalerColor:'av-green',
    urgency:'medium', initialState:'open',
  },
  'alert-4': {
    icon:'🏠', title:'Couverture + sac de couchage',
    desc:"Homme seul, ~60 ans, sous le pont de Grenelle — dort à même le sol depuis plusieurs nuits. Aidé par Stéphane B.",
    location:'Pont de Grenelle, Paris 15e', distance:'1,8 km • 🚶 22 min à pied',
    category:'Abri', items:'Couverture + sac de couchage', time:'Il y a 45 min',
    signaler:'Mohamed K.', signalerRating:'4.9', signalerAvatar:'M', signalerColor:'av-green',
    urgency:'medium', initialState:'me',
  },
  'alert-6': {
    icon:'💊', title:'Médicaments — douleurs importantes',
    desc:"Homme, ~50 ans, square de la République — se plaint de douleurs importantes, n'a pas les moyens d'acheter des antidouleurs.",
    location:'Square de la République, Paris 11e', distance:'2,9 km • 🚶 36 min à pied',
    category:'Médicaments', items:'Antidouleur (doliprane…)', time:'Il y a 8 min',
    signaler:'Lucas P.', signalerRating:'4.5', signalerAvatar:'L', signalerColor:'av-blue',
    urgency:'high', initialState:'open',
  },
  'alert-7': {
    icon:'🥣', title:'Soupe chaude + pain',
    desc:"Homme d'environ 55 ans assis sur les marches de la gare Montparnasse depuis le matin. Il n'a rien demandé mais n'a visiblement pas mangé.",
    location:'Gare Montparnasse, Paris 15e', distance:'850 m • 🚶 11 min à pied',
    category:'Nourriture', items:'Soupe chaude + baguette', time:'Il y a 1h10',
    signaler:'Élodie V.', signalerRating:'4.7', signalerAvatar:'É', signalerColor:'av-purple',
    urgency:'medium', initialState:'open',
  },
  'alert-8': {
    icon:'🍼', title:'Eau + lait infantile — bébé 8 mois',
    desc:"Mère seule avec son bébé de 8 mois devant la mairie du 3e. Le bébé pleure beaucoup — plus de lait depuis ce matin et la mère n'a pas d'argent.",
    location:'Mairie du 3e, Paris 3e', distance:'400 m • 🚶 5 min à pied',
    category:'Nourriture', items:'Lait infantile + eau', time:'Il y a 8 min',
    signaler:'Amandine C.', signalerRating:'5.0', signalerAvatar:'A', signalerColor:'av-green',
    urgency:'high', initialState:'open',
  },
  'alert-9': {
    icon:'👟', title:'Chaussures + chaussettes — H. taille 43',
    desc:"Homme d'environ 28 ans sous le pont de l'Alma. Ses chaussures sont complètement trouées et il se blesse en marchant. Se déplace péniblement.",
    location:"Pont de l'Alma, Paris 8e", distance:'1,5 km • 🚶 18 min à pied',
    category:'Vêtements', items:'Chaussures taille 43 + chaussettes', time:'Il y a 2h',
    signaler:'Rémi F.', signalerRating:'4.4', signalerAvatar:'R', signalerColor:'av-orange',
    urgency:'medium', initialState:'open',
  },
  'alert-10': {
    icon:'🧥', title:'Manteau femme + bonnet + gants',
    desc:"Femme d'environ 35 ans assise sur un banc boulevard Voltaire. Elle tremble, sa tenue est très légère pour la température. Taille M environ.",
    location:'Boulevard Voltaire, Paris 11e', distance:'700 m • 🚶 9 min à pied',
    category:'Vêtements', items:'Manteau taille M + bonnet + gants', time:'Il y a 12 min',
    signaler:'Yasmine B.', signalerRating:'4.8', signalerAvatar:'Y', signalerColor:'av-purple',
    urgency:'high', initialState:'open',
  },
  'alert-11': {
    icon:'🌸', title:'Produits hygiène féminine',
    desc:"Femme d'environ 25 ans dans le square des Batignolles. Elle demande de façon très discrète des serviettes hygiéniques et du savon.",
    location:'Square des Batignolles, Paris 17e', distance:'900 m • 🚶 11 min à pied',
    category:'Hygiène', items:'Serviettes hygiéniques + savon', time:'Il y a 45 min',
    signaler:'Nina K.', signalerRating:'4.9', signalerAvatar:'N', signalerColor:'av-green',
    urgency:'medium', initialState:'other', takenByOther:'Lucie D.', takenByOtherEta:'en route',
    participants:[
      { name:'Lucie D.', avatar:'L', color:'av-purple', status:'En route — ~20 min' },
    ],
  },
  'alert-12': {
    icon:'🩹', title:'Blessure au pied — soins urgents',
    desc:"Homme d'environ 40 ans pieds nus rue du Temple. Il a une plaie ouverte sous le pied droit et ne peut quasiment plus marcher. Besoin de pansements et d'antiseptique.",
    location:'Rue du Temple, Paris 3e', distance:'500 m • 🚶 6 min à pied',
    category:'Médical', items:'Pansements + antiseptique', time:'Il y a 15 min',
    signaler:'Pierre M.', signalerRating:'4.6', signalerAvatar:'P', signalerColor:'av-blue',
    urgency:'high', initialState:'open',
  },
  'alert-13': {
    icon:'🏕️', title:"Hébergement d'urgence — famille",
    desc:"Couple avec un enfant de 5 ans, porte de la Chapelle. À la rue depuis 2 jours après une expulsion. Besoin d'orientation vers un centre d'hébergement d'urgence.",
    location:'Porte de la Chapelle, Paris 18e', distance:'3,2 km • 🚶 38 min à pied',
    category:'Abri', items:"Place en centre d'hébergement", time:'Il y a 1h30',
    signaler:'Fatou D.', signalerRating:'4.7', signalerAvatar:'F', signalerColor:'av-orange',
    urgency:'medium', initialState:'open',
  },
  'alert-14': {
    icon:'⚖️', title:'Question RSA — homme sans ressources',
    desc:"Homme d'environ 38 ans à la gare de Lyon. Il ne touche pas le RSA mais pense y avoir droit. Il ne sait pas comment faire les démarches et a peur de mal comprendre les formulaires. Cherche un avocat ou conseiller bénévole.",
    location:'Gare de Lyon, Paris 12e', distance:'1,1 km • 🚶 14 min à pied',
    category:'Conseil juridique', items:'Droit au RSA / allocation sociale', time:'Il y a 25 min',
    signaler:'Karim B.', signalerRating:'4.6', signalerAvatar:'K', signalerColor:'av-blue',
    urgency:'high', initialState:'open',
  },
  'alert-15': {
    icon:'🩺', title:'Consultation médicale — femme diabétique',
    desc:"Femme d'environ 55 ans, rue de Belleville. Elle est diabétique mais n'a pas de couverture médicale (sans AME ni carte vitale). Elle n'a pas vu de médecin depuis plusieurs mois et se sent mal. Besoin d'un médecin bénévole.",
    location:'Rue de Belleville, Paris 20e', distance:'2,1 km • 🚶 26 min à pied',
    category:'Consultation médicale', items:'Consultation généraliste', time:'Il y a 40 min',
    signaler:'Nadia R.', signalerRating:'4.8', signalerAvatar:'N', signalerColor:'av-purple',
    urgency:'high', initialState:'open',
  },
  'alert-16': {
    icon:'🧠', title:'Soutien psychologique — état de crise',
    desc:"Jeune homme d'environ 22 ans au parc de Belleville. Il semble en grande détresse émotionnelle — assis seul depuis des heures, pleure. Il a besoin d'une écoute bienveillante et d'un soutien psychologique urgent.",
    location:'Parc de Belleville, Paris 20e', distance:'1,7 km • 🚶 21 min à pied',
    category:'Soutien psychologique', items:'Situation de crise aiguë', time:'Il y a 12 min',
    signaler:'Lucie M.', signalerRating:'4.9', signalerAvatar:'L', signalerColor:'av-green',
    urgency:'high', initialState:'open',
  },
  'alert-17': {
    icon:'🚌', title:'Transport — rendez-vous préfecture',
    desc:"Homme d'environ 45 ans, sans véhicule ni titre de transport. Il a un rendez-vous urgent à la préfecture demain matin pour renouveler ses papiers. Il ne peut pas marcher jusqu'aux transports en commun. Cherche un covoiturage ou un conducteur bénévole.",
    location:'Rue de la Roquette, Paris 11e', distance:'0,9 km • 🚶 11 min à pied',
    category:'Transport', items:'Covoiturage / accompagnement véhicule', time:'Il y a 1h',
    signaler:'Fatou D.', signalerRating:'4.7', signalerAvatar:'F', signalerColor:'av-purple',
    urgency:'medium', initialState:'open',
  },
  'alert-18': {
    icon:'🤝', title:'Accompagnement — démarches CAF',
    desc:"Femme d'environ 35 ans avec deux enfants, domiciliée Belleville. Elle a reçu un courrier de la CAF qu'elle ne comprend pas. Elle a besoin qu'on l'accompagne ou l'aide à comprendre les démarches et compléter un dossier en ligne.",
    location:'Rue de Belleville, Paris 20e', distance:'2,0 km • 🚶 25 min à pied',
    category:'Accompagnement', items:'Aide administrative CAF', time:'Il y a 2h',
    signaler:'Omar S.', signalerRating:'4.5', signalerAvatar:'O', signalerColor:'av-orange',
    urgency:'medium', initialState:'open',
  },
};

/* ── Conversations privées ── */
const privateChatData = {
  sophie: {
    name: 'Sophie L.', subtitle: 'En ligne maintenant',
    avatar: 'S', color: 'av-blue',
    alertRef: '👕 Manteau + pantalon — Rue de la Paix',
    messages: [
      { from:'Sophie L.',   avatar:'S', color:'av-blue',   text:"Bonjour ! J'ai vu votre signalement. J'ai un manteau taille L en très bon état.", time:'14:20' },
      { from:'Stéphane B.', avatar:'S', color:'av-orange', text:"Super ! Merci beaucoup. Pouvez-vous l'apporter rue de la Paix ?", time:'14:22' },
      { from:'Sophie L.',   avatar:'S', color:'av-blue',   text:"Oui je pars maintenant, j'arrive dans environ 20 minutes.", time:'14:28' },
      { from:'Stéphane B.', avatar:'S', color:'av-orange', text:"Il est encore là, côté vitrine de la pharmacie. Merci !", time:'14:30' },
      { from:'Sophie L.',   avatar:'S', color:'av-blue',   text:"Je peux apporter le manteau dans 20 minutes", time:'14:32' },
    ]
  },
  thomas: {
    name: 'Thomas R.', subtitle: 'Vu hier',
    avatar: 'T', color: 'av-green',
    alertRef: '🧴 Kit hygiène — Gare du Nord',
    messages: [
      { from:'Thomas R.',   avatar:'T', color:'av-green',  text:"Bonjour ! Je passe devant la gare du Nord ce soir vers 18h. Je peux apporter le kit.", time:'Hier 15:10' },
      { from:'Stéphane B.', avatar:'S', color:'av-orange', text:"Merci Thomas ! Il était encore là tout à l'heure. Je vais confirmer.", time:'Hier 15:30' },
      { from:'Thomas R.',   avatar:'T', color:'av-green',  text:"C'est fait ! Il était encore là, très reconnaissant. 🙏", time:'Hier 18:12' },
      { from:'Stéphane B.', avatar:'S', color:'av-orange', text:"Merci beaucoup, tu es formidable !", time:'Hier 18:20' },
      { from:'Thomas R.',   avatar:'T', color:'av-green',  text:"Parfait, merci beaucoup ! 🙏", time:'Hier 16:45' },
    ]
  }
};

/* ── Restaurer les signalements créés dans les sessions précédentes ── */
(function loadPersistedSignals() {
  try {
    const saved = JSON.parse(localStorage.getItem('humeo_my_signals') || '[]');
    saved.forEach(a => { if (a.id && !alertsData[a.id]) alertsData[a.id] = a; });
  } catch(e) {}
  setTimeout(updateAidesBadge, 100);
})();
