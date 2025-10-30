# PDF/EXCEL IMPORT QO‘LLANMASI (DRAFT)

1. **Fayl formati**
   - PDF: har bir savol alohida sahifadan boshlanishi tavsiya etiladi.
   - Excel: birinchi qatorda ustun nomlari (`question`, `option_a`, `option_b`, ...).
2. **Til va kodlash**
   - UTF-8 ni ishlatish.
   - Maxsus belgilar (ə, ğ, ʼ) to‘g‘ri ko‘rsatilishini tekshirish.
3. **Savol turlari**
   - 1-bosqich: faqat multiple-choice (4 ta variant).
   - Keyingi bosqichlarda open-ended va audio qo‘shiladi.
4. **Tekshiruv**
   - Importdan oldin fayl strukturasini validatsiya qiluvchi skript ishlaydi.
   - Xatoliklar Telegram bot yoki admin panel orqali qaytariladi.

> Ushbu qo‘llanma o‘qituvchilar uchun draft. Yakuniy reglament Supabase sxemasi va UI tayyor bo‘lgach yangilanadi.
