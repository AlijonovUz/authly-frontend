// Chap paneldagi xizmatlar ro'yxati.
// TODO: har bir xizmatning haqiqiy manzili qo'yilsin (Figma'da hammasida muloqot.raqamlinazorat.uz)
const URL = 'muloqot.raqamlinazorat.uz'

const RESERVE = {
  title: "Xizmat ko'rsatish yo'nalishi (Zaxira)",
  text: "Rejalashtirilayotgan yangi yo'nalishdagi xizmat ko'rsatish loyihasi",
}

export const SERVICES = [
  { title: 'Raqamli muloqot', text: "Onlayn audio/video yig'ilishlar va videokonferensiyalarni tashkil etish platformasi" },
  { title: 'Raqamli taksi', text: "Yo'lovchi tashish xizmatlarini boshqarish, buyurtmalar va haydovchilar faoliyati nazorati tizimi" },
  { title: 'Raqamli barber', text: 'Barbershoplar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi' },
  { title: 'Raqamli salon', text: "Go'zallik salonlar uchun mijozlar qabuli, onlayn navbat va xizmatlar hisobi" },
  { title: 'Raqamli choyxona', text: 'Umumiy ovqatlanish maskanlari va choyxonalar uchun joy band qilish hamda buyurtmalar boshqaruvi' },
  { title: 'Raqamli stomatologiya', text: 'Stomatologiya klinikalari uchun bemorlar qabuli, elektron tibbiy kartalar va xizmatlar hisobi tizimi' },
  RESERVE,
  { title: 'Raqamli kunlik ishchi', text: "Mavsumiy va kunlik ishchilar hamda buyurtmachilar o'rtasida bandlikni tezkor muvofiqlashtirish platformasi" },
  { title: 'Raqamli hamshira', text: "Uyda tibbiy yordam ko'rsatish, malakali hamshiralarni chaqirish va tibbiy xizmatlar monitoringi" },
  RESERVE,
  { title: 'Raqamli dorixona', text: "Dorixonalar tarmog'i, dori vositalari qoldig'i, narxlari va savdoni avtomatlashtirish tizimi" },
  { title: 'Raqamli bozorchi', text: 'Bozorlar va savdo rastalari uchun tovarlar aylanmasi, yetkazib berish va hisob-kitob platformasi' },
  { title: 'Raqamli sport CRM', text: 'Fitnes klublar va sport majmualari uchun mijozlar tashrifi, abonementlar va murabbiylar CRM tizimi' },
  { title: 'Raqamli avto-servis va ehtiyot qismlar', text: 'Avtotexxizmat ustaxonalari va ehtiyot qismlar savdosi jarayonlarini avtomatlashtirish tizimi' },
  RESERVE,
  { title: 'Raqamli shtamp', text: 'Muhr va shtamplar tayyorlashga buyurtma olish, hisobga olish va elektron verifikatsiya xizmati' },
  { title: 'Raqamli audit', text: "Moliyaviy va xo'jalik faoliyati auditi, tekshiruvlar hisobi va ekspertiza xulosalarini yuritish tizimi" },
  { title: "Maishiy xizmatlar (Ta'mirlash)", text: "Maishiy texnika va uy jihozlarini ta'mirlash ustalari xizmatlarini boshqarish tizimi" },
  { title: 'Raqamli advokat', text: 'Yuridik byurolar va advokatlar uchun ish yurituv, sud hujjatlari va mijozlar hisobi tizimi' },
  { title: "Raqamli to'qimachilik (Tekstil) CRM", text: "To'qimachilik va tikuvchilik korxonalari uchun xomashyo, ishlab chiqarish va buyurtmalar CRM tizimi" },
  RESERVE,
  // TODO: quyidagi ikki tavsif Figma'da to'liq ko'rinmaydi — matnni tekshirish kerak
  { title: 'Yetkazib berish va logistika xizmati', text: 'Tezkor yetkazib berish, posilkalar nazorati va kuryerlar faoliyatini boshqarish tizimi' },
  { title: 'Klining va tozalash xizmati', text: 'Kvartiralar, xususiy xonadonlar va ofislarni tozalash xizmatlariga buyurtma berish platformasi' },
  { title: "Raqamli ta'lim CRM", text: "O'quv markazlari va kurslar uchun talabalar bazasi, davomat, jadvallar va to'lovlar hisobi CRM tizimi" },
].map((s) => ({ ...s, url: URL }))
