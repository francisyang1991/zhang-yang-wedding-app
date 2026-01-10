import type { Guest, ScheduleEvent } from '../types';

const formatAccommodation = (accommodation?: Guest['accommodation']): string => {
  if (!accommodation) return 'Not specified';
  if (accommodation === 'andaz') return 'Andaz';
  if (accommodation === 'ac_hotel') return 'AC Hotel';
  if (accommodation === 'self') return 'Self booked / Other';
  return accommodation;
};

const formatBookingMethod = (bookingMethod?: string): string => {
  if (!bookingMethod) return 'Not specified';
  return bookingMethod.replace(/_/g, ' ');
};

const formatRoomDetail = (roomDetail?: string): string => {
  if (!roomDetail) return 'Not specified';
  return roomDetail.replace(/_/g, ' ');
};

export function buildGuestConfirmationEmailText(args: {
  guest: Guest;
  schedule: ScheduleEvent[];
}): { subject: string; body: string } {
  const { guest, schedule } = args;

  const fullName = `${guest.firstName} ${guest.lastName}`.trim();
  const greetingName = guest.firstName?.trim() || fullName || 'there';

  const scheduleLines: string[] = [];
  if (schedule.length > 0) {
    scheduleLines.push('Wedding Schedule');
    scheduleLines.push('----------------');

    let currentSection: string | null = null;
    schedule.forEach((ev) => {
      const section = `${ev.day}${ev.date ? ` (${ev.date})` : ''}`;
      if (section !== currentSection) {
        scheduleLines.push('');
        scheduleLines.push(section);
        currentSection = section;
      }

      const line = `- ${ev.time} — ${ev.title}${ev.location ? ` @ ${ev.location}` : ''}`;
      scheduleLines.push(line);
      if (ev.attire) scheduleLines.push(`  Attire: ${ev.attire}`);
      if (ev.description) scheduleLines.push(`  ${ev.description}`);
    });
  }

  const bodyLines: string[] = [
    `Dear ${greetingName},`,
    '',
    'Thank you for your RSVP! We are so excited to celebrate with you in Maui.',
    '',
    'Your RSVP details',
    '----------------',
    `Name: ${fullName || 'Not specified'}`,
    `Email: ${guest.email || 'Not specified'}`,
    `Phone: ${guest.phone || 'Not specified'}`,
    `Status: ${guest.rsvpStatus}`,
    '',
    `Accommodation: ${formatAccommodation(guest.accommodation)}`,
    `Room details: ${formatRoomDetail(guest.roomDetail)}`,
    `Booking method: ${formatBookingMethod(guest.bookingMethod)}`,
    '',
    `Dinner selection: ${guest.mealChoice || 'Not specified'}`,
    `Dietary restrictions: ${guest.dietaryRestrictions || 'None'}`,
    '',
    `Plus one: ${guest.plusOne ? (guest.plusOneName || 'Yes') : 'No'}`,
    '',
    `Notes: ${guest.note || 'None'}`,
  ];

  if (scheduleLines.length > 0) {
    bodyLines.push('');
    bodyLines.push('');
    bodyLines.push(...scheduleLines);
  }

  bodyLines.push('');
  bodyLines.push('');
  bodyLines.push('With love,');
  bodyLines.push('Zhang & Yang');

  return {
    subject: 'Wedding RSVP Confirmation — Zhang & Yang',
    body: bodyLines.join('\n'),
  };
}

