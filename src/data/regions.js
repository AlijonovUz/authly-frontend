// O'zbekiston viloyatlari va tumanlari.
// TODO: backend ma'lumotnomasi tayyor bo'lsa, API'dan olinsin.

const region = (name, cities, districts) => ({
  name,
  districts: [
    ...cities.map((c) => `${c} shahar`),
    ...districts.map((d) => `${d} tumani`),
  ],
})

export const REGIONS = [
  region('Toshkent shahri', [], [
    'Bektemir', 'Chilonzor', 'Mirobod', 'Mirzo Ulugʻbek', 'Olmazor', 'Sergeli',
    'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yangihayot', 'Yashnobod', 'Yunusobod',
  ]),
  region('Toshkent viloyati',
    ['Nurafshon', 'Angren', 'Bekobod', 'Chirchiq', 'Olmaliq', 'Ohangaron', 'Yangiyoʻl'],
    [
      'Bekobod', 'Boʻka', 'Boʻstonliq', 'Chinoz', 'Ohangaron', 'Oqqoʻrgʻon', 'Oʻrta Chirchiq',
      'Parkent', 'Piskent', 'Qibray', 'Quyi Chirchiq', 'Toshkent', 'Yangiyoʻl',
      'Yuqori Chirchiq', 'Zangiota',
    ]),
  region('Andijon', ['Andijon', 'Xonobod'], [
    'Andijon', 'Asaka', 'Baliqchi', 'Boʻston', 'Buloqboshi', 'Izboskan', 'Jalaquduq',
    'Marhamat', 'Oltinkoʻl', 'Paxtaobod', 'Qoʻrgʻontepa', 'Shahrixon', 'Ulugʻnor', 'Xoʻjaobod',
  ]),
  region('Buxoro', ['Buxoro', 'Kogon'], [
    'Buxoro', 'Gʻijduvon', 'Jondor', 'Kogon', 'Olot', 'Peshku', 'Qorakoʻl', 'Qorovulbozor',
    'Romitan', 'Shofirkon', 'Vobkent',
  ]),
  region('Fargʻona', ['Fargʻona', 'Margʻilon', 'Qoʻqon', 'Quvasoy'], [
    'Beshariq', 'Bogʻdod', 'Buvayda', 'Dangʻara', 'Fargʻona', 'Furqat', 'Oltiariq', 'Oʻzbekiston',
    'Qoʻshtepa', 'Quva', 'Rishton', 'Soʻx', 'Toshloq', 'Uchkoʻprik', 'Yozyovon',
  ]),
  region('Jizzax', ['Jizzax'], [
    'Arnasoy', 'Baxmal', 'Doʻstlik', 'Forish', 'Gʻallaorol', 'Mirzachoʻl', 'Paxtakor',
    'Sharof Rashidov', 'Yangiobod', 'Zafarobod', 'Zarbdor', 'Zomin',
  ]),
  region('Xorazm', ['Urganch', 'Xiva'], [
    'Bogʻot', 'Gurlan', 'Hazorasp', 'Qoʻshkoʻpir', 'Shovot', 'Tuproqqalʼa', 'Urganch', 'Xiva',
    'Xonqa', 'Yangiariq', 'Yangibozor',
  ]),
  region('Namangan', ['Namangan'], [
    'Chortoq', 'Chust', 'Davlatobod', 'Kosonsoy', 'Mingbuloq', 'Namangan', 'Norin', 'Pop',
    'Toʻraqoʻrgʻon', 'Uchqoʻrgʻon', 'Uychi', 'Yangiqoʻrgʻon',
  ]),
  region('Navoiy', ['Navoiy', 'Zarafshon', 'Gʻozgʻon'], [
    'Karmana', 'Konimex', 'Navbahor', 'Nurota', 'Qiziltepa', 'Tomdi', 'Uchquduq', 'Xatirchi',
  ]),
  region('Qashqadaryo', ['Qarshi', 'Shahrisabz'], [
    'Chiroqchi', 'Dehqonobod', 'Gʻuzor', 'Kasbi', 'Kitob', 'Koson', 'Koʻkdala', 'Mirishkor',
    'Muborak', 'Nishon', 'Qamashi', 'Qarshi', 'Shahrisabz', 'Yakkabogʻ',
  ]),
  region('Qoraqalpogʻiston Respublikasi', ['Nukus'], [
    'Amudaryo', 'Beruniy', 'Boʻzatov', 'Chimboy', 'Ellikqalʼa', 'Kegeyli', 'Moʻynoq', 'Nukus',
    'Qanlikoʻl', 'Qoraoʻzak', 'Qoʻngʻirot', 'Shumanay', 'Taxiatosh', 'Taxtakoʻpir', 'Toʻrtkoʻl',
    'Xoʻjayli',
  ]),
  region('Samarqand', ['Samarqand', 'Kattaqoʻrgʻon'], [
    'Bulungʻur', 'Ishtixon', 'Jomboy', 'Kattaqoʻrgʻon', 'Narpay', 'Nurobod', 'Oqdaryo',
    'Pastdargʻom', 'Paxtachi', 'Payariq', 'Qoʻshrabot', 'Samarqand', 'Toyloq', 'Urgut',
  ]),
  region('Sirdaryo', ['Guliston', 'Shirin', 'Yangiyer'], [
    'Boyovut', 'Guliston', 'Mirzaobod', 'Oqoltin', 'Sardoba', 'Sayxunobod', 'Sirdaryo', 'Xovos',
  ]),
  region('Surxondaryo', ['Termiz'], [
    'Angor', 'Bandixon', 'Boysun', 'Denov', 'Jarqoʻrgʻon', 'Muzrabot', 'Oltinsoy', 'Qiziriq',
    'Qumqoʻrgʻon', 'Sariosiyo', 'Sherobod', 'Shoʻrchi', 'Termiz', 'Uzun',
  ]),
]
