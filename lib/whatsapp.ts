import { Order } from './types';

export function formatWhatsAppOrderMessage(order: Order, siteName: string = 'كشري هند'): string {
  const orderTypeText =
    order.orderType === 'delivery'
      ? 'توصيل للمنزل 🛵'
      : order.orderType === 'pickup'
      ? 'استلام من الفرع 🏪'
      : 'صالة / بالداخل 🍽️';

  const paymentText =
    order.paymentMethod === 'cash'
      ? 'دفع كاش عند الاستلام 💵'
      : order.paymentMethod === 'vodafone_cash'
      ? 'فودافون كاش 📱'
      : 'فيزا / كارت إلكتروني 💳';

  let msg = `*طلب جديد - ${siteName}* 🍜\n`;
  msg += `*رقم الفاتورة:* #${order.id}\n`;
  msg += `----------------------------------\n`;
  msg += `*اسم العميل:* ${order.customer.name}\n`;
  msg += `*رقم الهاتف:* ${order.customer.phone}\n`;
  if (order.customer.address) {
    msg += `*العنوان:* ${order.customer.address}\n`;
  }
  if (order.customer.buildingFloor) {
    msg += `*تفاصيل الدور/الشقة:* ${order.customer.buildingFloor}\n`;
  }
  msg += `*طريقة الاستلام:* ${orderTypeText}\n`;
  msg += `*طريقة الدفع:* ${paymentText}\n`;
  msg += `----------------------------------\n`;
  msg += `*تفاصيل الأطباق المطلوبة:*\n`;

  order.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.menuItem.name}* (عدد ${item.quantity})\n`;
    if (item.selectedSize) {
      msg += `   - الحجم: ${item.selectedSize.name}\n`;
    }
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      msg += `   - الإضافات: ${item.selectedAddons.map((a) => a.name).join(' + ')}\n`;
    }
    if (item.notes) {
      msg += `   - ملاحظات خاصة: ${item.notes}\n`;
    }
    msg += `   - السعر: ${item.totalPrice} ج.م\n`;
  });

  msg += `----------------------------------\n`;
  msg += `*المجموع الفرعي:* ${order.subtotal} ج.م\n`;
  if (order.deliveryFee > 0) {
    msg += `*رسوم التوصيل:* ${order.deliveryFee} ج.م\n`;
  }
  if (order.discount > 0) {
    msg += `*الخصم المطبق:* ${order.discount} ج.م\n`;
  }
  msg += `*الإجمالي المستحق:* ${order.total} ج.م 💥\n`;

  if (order.customer.notes) {
    msg += `----------------------------------\n`;
    msg += `*تعليمات إضافية:* ${order.customer.notes}\n`;
  }

  msg += `\nشكرًا لطلبكم من ${siteName}! ❤️`;

  return encodeURIComponent(msg);
}

export function openWhatsAppOrderLink(order: Order, phone: string = '201012345678', siteName: string = 'كشري هند') {
  const text = formatWhatsAppOrderMessage(order, siteName);
  // Clean phone number: remove non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone || '201012345678'}?text=${text}`;
  window.open(url, '_blank');
}
