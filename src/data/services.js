// Chap paneldagi xizmatlar ro'yxati. title va text — har bir til uchun: { uz, ru, en }
// TODO: har bir xizmatning haqiqiy manzili qo'yilsin (Figma'da hammasida muloqot.raqamlinazorat.uz)
const URL = 'muloqot.raqamlinazorat.uz'

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
}

export const SERVICES = [
  {
    title: { uz: 'Raqamli muloqot', ru: 'Цифровое общение', en: 'Digital meetings' },
    text: {
      uz: "Onlayn audio/video yig'ilishlar va videokonferensiyalarni tashkil etish platformasi",
      ru: 'Платформа для онлайн аудио- и видеовстреч и видеоконференций',
      en: 'A platform for online audio/video meetings and video conferences',
    },
  },
  {
    title: { uz: 'Raqamli taksi', ru: 'Цифровое такси', en: 'Digital taxi' },
    text: {
      uz: "Yo'lovchi tashish xizmatlarini boshqarish, buyurtmalar va haydovchilar faoliyati nazorati tizimi",
      ru: 'Система управления пассажирскими перевозками, заказами и контролем работы водителей',
      en: 'A system for managing passenger transport, orders and driver activity',
    },
  },
  {
    title: { uz: 'Raqamli barber', ru: 'Цифровой барбер', en: 'Digital barber' },
    text: {
      uz: 'Barbershoplar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi',
      ru: 'Приём клиентов, онлайн-очередь и учёт услуг для барбершопов',
      en: 'Client bookings, online queue and service records for barbershops',
    },
  },
  {
    title: { uz: 'Raqamli salon', ru: 'Цифровой салон', en: 'Digital salon' },
    text: {
      uz: "Go'zallik salonlar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi",
      ru: 'Приём клиентов, онлайн-очередь и учёт услуг для салонов красоты',
      en: 'Client bookings, online queue and service records for beauty salons',
    },
  },
  {
    title: { uz: 'Raqamli choyxona', ru: 'Цифровая чайхана', en: 'Digital teahouse' },
    text: {
      uz: 'Umumiy ovqatlanish maskanlari va choyxonalar uchun joy band qilish hamda buyurtmalar boshqaruvi',
      ru: 'Бронирование мест и управление заказами для заведений общепита и чайхан',
      en: 'Table reservations and order management for eateries and teahouses',
    },
  },
  {
    title: { uz: 'Raqamli stomatologiya', ru: 'Цифровая стоматология', en: 'Digital dentistry' },
    text: {
      uz: 'Stomatologiya klinikalari uchun bemorlar qabuli, elektron tibbiy kartalar va xizmatlar hisobi tizimi',
      ru: 'Система приёма пациентов, электронных медкарт и учёта услуг для стоматологических клиник',
      en: 'Patient appointments, electronic medical records and service records for dental clinics',
    },
  },
  RESERVE,
  {
    title: { uz: 'Raqamli kunlik ishchi', ru: 'Цифровой подёнщик', en: 'Digital day labour' },
    text: {
      uz: "Mavsumiy va kunlik ishchilar hamda buyurtmachilar o'rtasida bandlikni tezkor muvofiqlashtirish platformasi",
      ru: 'Платформа быстрой координации занятости между сезонными и подёнными работниками и заказчиками',
      en: 'A platform for quickly matching seasonal and day workers with customers',
    },
  },
  {
    title: { uz: 'Raqamli hamshira', ru: 'Цифровая медсестра', en: 'Digital nurse' },
    text: {
      uz: "Uyda tibbiy yordam ko'rsatish, malakali hamshiralarni chaqirish va tibbiy xizmatlar monitoringi",
      ru: 'Медицинская помощь на дому, вызов квалифицированных медсестёр и мониторинг медуслуг',
      en: 'Home medical care, calling qualified nurses and monitoring medical services',
    },
  },
  RESERVE,
  {
    title: { uz: 'Raqamli dorixona', ru: 'Цифровая аптека', en: 'Digital pharmacy' },
    text: {
      uz: "Dorixonalar tarmog'i, dori vositalari qoldig'i, narxlari va savdoni avtomatlashtirish tizimi",
      ru: 'Система автоматизации аптечной сети: остатки лекарств, цены и продажи',
      en: 'Automation for pharmacy chains: medicine stock, prices and sales',
    },
  },
  {
    title: { uz: 'Raqamli bozorchi', ru: 'Цифровой рынок', en: 'Digital market' },
    text: {
      uz: 'Bozorlar va savdo rastalari uchun tovarlar aylanmasi, yetkazib berish va hisob-kitob platformasi',
      ru: 'Платформа товарооборота, доставки и расчётов для рынков и торговых рядов',
      en: 'Goods turnover, delivery and settlement platform for markets and trading stalls',
    },
  },
  {
    title: { uz: 'Raqamli sport CRM', ru: 'Цифровой спорт CRM', en: 'Digital sports CRM' },
    text: {
      uz: 'Fitnes klublar va sport majmualari uchun mijozlar tashrifi, abonementlar va murabbiylar CRM tizimi',
      ru: 'CRM посещений, абонементов и тренеров для фитнес-клубов и спорткомплексов',
      en: 'CRM for visits, memberships and coaches at fitness clubs and sports centres',
    },
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
  },
  RESERVE,
  {
    title: { uz: 'Raqamli shtamp', ru: 'Цифровой штамп', en: 'Digital stamp' },
    text: {
      uz: 'Muhr va shtamplar tayyorlashga buyurtma olish, hisobga olish va elektron verifikatsiya xizmati',
      ru: 'Приём заказов на изготовление печатей и штампов, их учёт и электронная верификация',
      en: 'Ordering, registering and electronically verifying seals and stamps',
    },
  },
  {
    title: { uz: 'Raqamli audit', ru: 'Цифровой аудит', en: 'Digital audit' },
    text: {
      uz: "Moliyaviy va xo'jalik faoliyati auditi, tekshiruvlar hisobi va ekspertiza xulosalarini yuritish tizimi",
      ru: 'Система аудита финансово-хозяйственной деятельности, учёта проверок и экспертных заключений',
      en: 'Financial and business audits, inspection records and expert reports',
    },
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
  },
  {
    title: { uz: 'Raqamli advokat', ru: 'Цифровой адвокат', en: 'Digital lawyer' },
    text: {
      uz: 'Yuridik byurolar va advokatlar uchun ish yurituv, sud hujjatlari va mijozlar hisobi tizimi',
      ru: 'Система делопроизводства, судебных документов и учёта клиентов для юридических бюро и адвокатов',
      en: 'Case management, court documents and client records for law firms and lawyers',
    },
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
  },
  RESERVE,
  // TODO: quyidagi ikki tavsif Figma'da to'liq ko'rinmaydi — matnni tekshirish kerak
  {
    title: {
      uz: 'Yetkazib berish va logistika xizmati',
      ru: 'Служба доставки и логистики',
      en: 'Delivery and logistics service',
    },
    text: {
      uz: 'Tezkor yetkazib berish, posilkalar nazorati va kuryerlar faoliyatini boshqarish tizimi',
      ru: 'Система экспресс-доставки, отслеживания посылок и управления работой курьеров',
      en: 'Express delivery, parcel tracking and courier management',
    },
  },
  {
    title: {
      uz: 'Klining va tozalash xizmati',
      ru: 'Клининг и услуги уборки',
      en: 'Cleaning service',
    },
    text: {
      uz: 'Kvartiralar, xususiy xonadonlar va ofislarni tozalash xizmatlariga buyurtma berish platformasi',
      ru: 'Платформа заказа уборки квартир, частных домов и офисов',
      en: 'A platform for ordering cleaning of flats, private houses and offices',
    },
  },
  {
    title: { uz: "Raqamli ta'lim CRM", ru: 'Цифровое образование CRM', en: 'Digital education CRM' },
    text: {
      uz: "O'quv markazlari va kurslar uchun talabalar bazasi, davomat, jadvallar va to'lovlar hisobi CRM tizimi",
      ru: 'CRM базы учащихся, посещаемости, расписаний и оплат для учебных центров и курсов',
      en: 'CRM for student records, attendance, timetables and payments at learning centres and courses',
    },
  },
].map((s) => ({ ...s, url: URL }))
