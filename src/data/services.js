// Chap paneldagi xizmatlar ro'yxati. title va text — har bir til uchun: { uz, ru, en }
// url — protokolsiz manzil (kartada shunday ko'rinadi, havolaga https:// qo'shiladi)
export const DOMAIN = 'raqamlinazorat.uz'
const site = (sub) => `${sub}.${DOMAIN}`

// Alohida manzili yo'q yo'nalishlar umumiy xizmatlar portaliga olib boradi
const COMMON_URL = site('xizmat')

const RESERVE = {
  title: {
    uz: "Xizmat ko'rsatish yo'nalishi (Zaxira)",
    ru: 'Направление услуг (Резерв)',
    en: 'Service line (Reserve)',
  },
  text: {
    uz: "Rejalashtirilayotgan yangi yo'nalishdagi xizmat ko'rsatish loyihasi",
    ru: 'Планируемый проект услуг в новом направлении',
    en: 'A planned service project in a new line of business',
  },
  url: COMMON_URL,
}

const SERVICE_RESERVE = {
  title: {
    uz: 'Raqamli servis (Zaxira)',
    ru: 'Цифровой сервис (Резерв)',
    en: 'Digital service (Reserve)',
  },
  text: {
    uz: 'Kelgusida joriy etish uchun rejalashtirilgan zaxiradagi xizmat loyihasi',
    ru: 'Резервный проект услуг, запланированный к внедрению в будущем',
    en: 'A reserve service project planned for future rollout',
  },
  url: COMMON_URL,
}

export const SERVICES = [
  {
    title: { uz: 'Raqamli muloqot', ru: 'Цифровое общение', en: 'Digital meetings' },
    text: {
      uz: "Onlayn audio/video yig'ilishlar va videokonferensiyalarni tashkil etish platformasi",
      ru: 'Платформа для онлайн аудио- и видеовстреч и видеоконференций',
      en: 'A platform for online audio/video meetings and video conferences',
    },
    url: site('muloqot'),
  },
  {
    title: { uz: 'Raqamli taksi', ru: 'Цифровое такси', en: 'Digital taxi' },
    text: {
      uz: "Yo'lovchi tashish xizmatlarini boshqarish, buyurtmalar va haydovchilar faoliyati nazorati tizimi",
      ru: 'Система управления пассажирскими перевозками, заказами и контролем работы водителей',
      en: 'A system for managing passenger transport, orders and driver activity',
    },
    url: site('taxi'),
  },
  {
    title: { uz: 'Raqamli barber', ru: 'Цифровой барбер', en: 'Digital barber' },
    text: {
      uz: 'Barbershoplar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi',
      ru: 'Приём клиентов, онлайн-очередь и учёт услуг для барбершопов',
      en: 'Client bookings, online queue and service records for barbershops',
    },
    url: site('barber'),
  },
  {
    title: { uz: 'Raqamli salon', ru: 'Цифровой салон', en: 'Digital salon' },
    text: {
      uz: "Go'zallik salonlar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi",
      ru: 'Приём клиентов, онлайн-очередь и учёт услуг для салонов красоты',
      en: 'Client bookings, online queue and service records for beauty salons',
    },
    url: site('salon'),
  },
  {
    title: { uz: 'Raqamli choyxona', ru: 'Цифровая чайхана', en: 'Digital teahouse' },
    text: {
      uz: 'Umumiy ovqatlanish maskanlari va choyxonalar uchun joy band qilish hamda buyurtmalar boshqaruvi',
      ru: 'Бронирование мест и управление заказами для заведений общепита и чайхан',
      en: 'Table reservations and order management for eateries and teahouses',
    },
    url: site('choyxona'),
  },
  {
    title: { uz: 'Raqamli stomatologiya', ru: 'Цифровая стоматология', en: 'Digital dentistry' },
    text: {
      uz: 'Stomatologiya klinikalari uchun bemorlar qabuli, elektron tibbiy kartalar va xizmatlar hisobi tizimi',
      ru: 'Система приёма пациентов, электронных медкарт и учёта услуг для стоматологических клиник',
      en: 'Patient appointments, electronic medical records and service records for dental clinics',
    },
    url: site('stomatologiya'),
  },
  RESERVE,
  {
    title: { uz: 'Raqamli kunlik ishchi', ru: 'Цифровой подёнщик', en: 'Digital day labour' },
    text: {
      uz: "Mavsumiy va kunlik ishchilar hamda buyurtmachilar o'rtasida bandlikni tezkor muvofiqlashtirish platformasi",
      ru: 'Платформа быстрой координации занятости между сезонными и подёнными работниками и заказчиками',
      en: 'A platform for quickly matching seasonal and day workers with customers',
    },
    url: site('kunlik-ishchi'),
  },
  {
    title: { uz: 'Raqamli hamshira', ru: 'Цифровая медсестра', en: 'Digital nurse' },
    text: {
      uz: "Uyda tibbiy yordam ko'rsatish, malakali hamshiralarni chaqirish va tibbiy xizmatlar monitoringi",
      ru: 'Медицинская помощь на дому, вызов квалифицированных медсестёр и мониторинг медуслуг',
      en: 'Home medical care, calling qualified nurses and monitoring medical services',
    },
    url: site('hamshira'),
  },
  RESERVE,
  {
    title: { uz: 'Raqamli dorixona', ru: 'Цифровая аптека', en: 'Digital pharmacy' },
    text: {
      uz: "Dorixonalar tarmog'i, dori vositalari qoldig'i, narxlari va savdoni avtomatlashtirish tizimi",
      ru: 'Система автоматизации аптечной сети: остатки лекарств, цены и продажи',
      en: 'Automation for pharmacy chains: medicine stock, prices and sales',
    },
    url: site('dorixona'),
  },
  {
    title: { uz: 'Raqamli bozorchi', ru: 'Цифровой рынок', en: 'Digital market' },
    text: {
      uz: 'Bozorlar va savdo rastalari uchun tovarlar aylanmasi, yetkazib berish va hisob-kitob platformasi',
      ru: 'Платформа товарооборота, доставки и расчётов для рынков и торговых рядов',
      en: 'Goods turnover, delivery and settlement platform for markets and trading stalls',
    },
    url: site('bozorchi'),
  },
  {
    title: { uz: 'Raqamli sport CRM', ru: 'Цифровой спорт CRM', en: 'Digital sports CRM' },
    text: {
      uz: 'Fitnes klublar va sport majmualari uchun mijozlar tashrifi, abonementlar va murabbiylar CRM tizimi',
      ru: 'CRM посещений, абонементов и тренеров для фитнес-клубов и спорткомплексов',
      en: 'CRM for visits, memberships and coaches at fitness clubs and sports centres',
    },
    url: site('sport-crm'),
  },
  {
    title: {
      uz: 'Raqamli avto-servis va ehtiyot qismlar',
      ru: 'Цифровой автосервис и запчасти',
      en: 'Digital auto service and spare parts',
    },
    text: {
      uz: 'Avtotexxizmat ustaxonalari va ehtiyot qismlar savdosi jarayonlarini avtomatlashtirish tizimi',
      ru: 'Система автоматизации автомастерских и продажи запчастей',
      en: 'Automation for car repair shops and spare-parts sales',
    },
    url: site('avto-servise'),
  },
  RESERVE,
  {
    title: {
      uz: 'Raqamli sayohat firmasi',
      ru: 'Цифровая турфирма',
      en: 'Digital travel agency',
    },
    text: {
      uz: 'Turistik agentliklar uchun turlar, viza xizmatlari va sayohatchilar buyurtmalarini boshqarish tizimi',
      ru: 'Система управления турами, визовыми услугами и заказами путешественников для турагентств',
      en: 'Managing tours, visa services and traveller bookings for travel agencies',
    },
    url: site('sayohat-firma'),
  },
  {
    title: {
      uz: 'Raqamli xizmatlar agregatori',
      ru: 'Агрегатор цифровых услуг',
      en: 'Digital services aggregator',
    },
    text: {
      uz: "Turli sohalardagi maishiy va professional xizmat ko'rsatuvchilarni jamlovchi yagona portal",
      ru: 'Единый портал, объединяющий поставщиков бытовых и профессиональных услуг из разных сфер',
      en: 'A single portal bringing together household and professional service providers across sectors',
    },
    url: COMMON_URL,
  },
  {
    title: { uz: 'Raqamli buxgalteriya', ru: 'Цифровая бухгалтерия', en: 'Digital accounting' },
    text: {
      uz: 'Korxona va tashkilotlar uchun buxgalteriya hisoboti, birlamchi hujjatlar va moliyaviy hisobotlar platformasi',
      ru: 'Платформа бухгалтерского учёта, первичных документов и финансовой отчётности для предприятий и организаций',
      en: 'Bookkeeping, primary documents and financial reporting for companies and organisations',
    },
    url: site('buxgalter'),
  },
  {
    title: { uz: 'Raqamli shtamp', ru: 'Цифровой штамп', en: 'Digital stamp' },
    text: {
      uz: 'Muhr va shtamplar tayyorlashga buyurtma olish, hisobga olish va elektron verifikatsiya xizmati',
      ru: 'Приём заказов на изготовление печатей и штампов, их учёт и электронная верификация',
      en: 'Ordering, registering and electronically verifying seals and stamps',
    },
    url: site('shtamp'),
  },
  {
    title: { uz: 'Raqamli audit', ru: 'Цифровой аудит', en: 'Digital audit' },
    text: {
      uz: "Moliyaviy va xo'jalik faoliyati auditi, tekshiruvlar hisobi va ekspertiza xulosalarini yuritish tizimi",
      ru: 'Система аудита финансово-хозяйственной деятельности, учёта проверок и экспертных заключений',
      en: 'Financial and business audits, inspection records and expert reports',
    },
    url: site('audit'),
  },
  {
    title: {
      uz: "Maishiy xizmatlar (Ta'mirlash)",
      ru: 'Бытовые услуги (Ремонт)',
      en: 'Household services (Repair)',
    },
    text: {
      uz: "Maishiy texnika va uy jihozlarini ta'mirlash ustalari xizmatlarini boshqarish tizimi",
      ru: 'Система управления услугами мастеров по ремонту бытовой техники и мебели',
      en: 'Managing the services of appliance and furniture repair technicians',
    },
    url: COMMON_URL,
  },
  {
    title: { uz: 'Raqamli advokat', ru: 'Цифровой адвокат', en: 'Digital lawyer' },
    text: {
      uz: 'Yuridik byurolar va advokatlar uchun ish yurituv, sud hujjatlari va mijozlar hisobi tizimi',
      ru: 'Система делопроизводства, судебных документов и учёта клиентов для юридических бюро и адвокатов',
      en: 'Case management, court documents and client records for law firms and lawyers',
    },
    url: site('advokat'),
  },
  {
    title: {
      uz: "Raqamli to'qimachilik (Tekstil) CRM",
      ru: 'Цифровой текстиль CRM',
      en: 'Digital textile CRM',
    },
    text: {
      uz: "To'qimachilik va tikuvchilik korxonalari uchun xomashyo, ishlab chiqarish va buyurtmalar CRM tizimi",
      ru: 'CRM сырья, производства и заказов для текстильных и швейных предприятий',
      en: 'CRM for raw materials, production and orders at textile and sewing companies',
    },
    url: site('textil'),
  },
  RESERVE,
  {
    title: {
      uz: 'Yetkazib berish va logistika xizmati',
      ru: 'Служба доставки и логистики',
      en: 'Delivery and logistics service',
    },
    text: {
      uz: 'Tezkor yetkazib berish, posilkalar nazorati va kuryerlik faoliyatini boshqarish platformasi',
      ru: 'Платформа экспресс-доставки, отслеживания посылок и управления курьерской деятельностью',
      en: 'A platform for express delivery, parcel tracking and courier operations',
    },
    url: COMMON_URL,
  },
  {
    title: {
      uz: 'Klining va tozalash xizmati',
      ru: 'Клининг и услуги уборки',
      en: 'Cleaning service',
    },
    text: {
      uz: 'Kvartiralar, xususiy xonadonlar va ofislarni professional tozalash brigadalari boshqaruvi tizimi',
      ru: 'Система управления бригадами профессиональной уборки квартир, частных домов и офисов',
      en: 'Managing professional cleaning crews for flats, private houses and offices',
    },
    url: COMMON_URL,
  },
  {
    title: { uz: "Raqamli ta'lim CRM", ru: 'Цифровое образование CRM', en: 'Digital education CRM' },
    text: {
      uz: "O'quv markazlari va kurslar uchun talabalar bazasi, davomat, jadvallar va to'lovlar hisobi CRM tizimi",
      ru: 'CRM базы учащихся, посещаемости, расписаний и оплат для учебных центров и курсов',
      en: 'CRM for student records, attendance, timetables and payments at learning centres and courses',
    },
    url: site('talim'),
  },
  {
    title: {
      uz: 'Santexnika va usta xizmatlari',
      ru: 'Сантехника и услуги мастеров',
      en: 'Plumbing and handyman services',
    },
    text: {
      uz: 'Santexnika, isitish tizimlari va tegishli muhandislik xizmatlari buyurtmalarini muvofiqlashtirish',
      ru: 'Координация заказов на сантехнику, отопление и сопутствующие инженерные услуги',
      en: 'Coordinating orders for plumbing, heating and related engineering services',
    },
    url: COMMON_URL,
  },
  {
    title: {
      uz: 'Elektr montaj va sozlash xizmatlari',
      ru: 'Электромонтаж и наладка',
      en: 'Electrical installation and setup services',
    },
    text: {
      uz: "Elektr tarmoqlari, xonadonlar va tijorat obyektlarida montaj xizmatlarini ko'rsatuvchi ustalar platformasi",
      ru: 'Платформа мастеров по монтажу электросетей в жилых домах и на коммерческих объектах',
      en: 'A platform of electricians installing wiring in homes and commercial premises',
    },
    url: COMMON_URL,
  },
  SERVICE_RESERVE,
  {
    title: { uz: 'Raqamli tarjimon CRM', ru: 'Цифровой переводчик CRM', en: 'Digital translator CRM' },
    text: {
      uz: 'Tarjima markazlari uchun hujjatlar tarjimasi, notarial tasdiqlash va tarjimonlar ishini boshqarish CRM tizimi',
      ru: 'CRM перевода документов, нотариального заверения и управления работой переводчиков для бюро переводов',
      en: 'CRM for document translation, notarisation and translator workflow at translation centres',
    },
    url: site('tarjimon'),
  },
  SERVICE_RESERVE,
  {
    title: { uz: 'Raqamli qassobxona CRM', ru: 'Цифровая мясная лавка CRM', en: 'Digital butchery CRM' },
    text: {
      uz: "Go'sht mahsulotlari do'konlari va qassobxonalar uchun mahsulot kirimi, savdo va ta'minot CRM tizimi",
      ru: 'CRM прихода товара, продаж и снабжения для мясных магазинов и лавок',
      en: 'CRM for stock intake, sales and supply at meat shops and butcheries',
    },
    url: site('qassob'),
  },
]
