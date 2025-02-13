import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import signiture from '../images/bridal signiture.png';

const handleDownloadWeddingDressRentalContract = (reservation) => {
  const doc = new jsPDF();
  const clientDetails = reservation.client;
  const items = reservation.items || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + (item.rentalCost || 0),
    0
  );

  const additionalCost = reservation.additionalCost ?? 0;
  const travelCost = reservation.travelCost ?? 0;

  const subtotal = itemsTotal + additionalCost + travelCost;

  // Add content to the PDF
  doc.setFontSize(16);
  doc.text('Wedding Dress Rental Contract', 60, 20);

  doc.setFontSize(12);
  doc.text('Between:', 20, 30);
  doc.text(
    'The company The Bridal House, specializing in the rental of wedding dresses,',
    25,
    38,
    { lineHeightFactor: 0.5, align: 'justify', isSymmetricSwapping: true }
  );
  doc.text(
    'headquartered at 11 RUE CHAKIB ARSALANE MAGASIN 2 V.N. Fes Maroc,',
    25,
    46
  );
  doc.text(
    'represented by Hajar Choukri, hereinafter referred to as "The Lessor."',
    25,
    54
  );

  doc.text('And:', 20, 64);
  doc.setFont('helvetica', 'bold'); // Set to bold for the Lessee's name
  doc.text(`Mrs./Mr. ${clientDetails.name} ${clientDetails.surname},`, 25, 72);
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`residing at `, 25, 80);
  doc.setFont('helvetica', 'bold'); // Set to bold for address
  doc.text(
    `${clientDetails.address},`,
    25 + doc.getTextWidth(`residing at `),
    80
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`holder of ID number `, 25, 88);
  doc.setFont('helvetica', 'bold'); // Set to bold for ID number
  doc.text(
    `${clientDetails.idNumber},`,
    25 + doc.getTextWidth(`holder of ID number `),
    88
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text('hereinafter referred to as "The Lessee."', 25, 96);

  doc.text('Purpose of the Contract', 20, 106);
  doc.text(
    'This agreement concerns the rental of one or more wedding dresses from The Bridal',
    25,
    114
  );
  doc.text('House under the terms and conditions outlined below.', 25, 122);

  // Wedding Details
  doc.text('1. Wedding Details', 20, 132);
  doc.text(`• Wedding City: `, 25, 140);
  doc.setFont('helvetica', 'bold'); // Set to bold for wedding city
  doc.text(
    `${clientDetails.weddingCity}.`,
    25 + doc.getTextWidth(`• Wedding City: `),
    140
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`• Wedding Location: `, 25, 148);
  doc.setFont('helvetica', 'bold'); // Set to bold for wedding location
  doc.text(
    `${clientDetails.weddingLocation}.`,
    25 + doc.getTextWidth(`• Wedding Location: `),
    148
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`• Wedding Date: `, 25, 156);
  doc.setFont('helvetica', 'bold'); // Set to bold for wedding date
  doc.text(
    `${clientDetails.weddingDate}.`,
    25 + doc.getTextWidth(`• Wedding Date: `),
    156
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`• Wedding Time: `, 25, 164);
  doc.setFont('helvetica', 'bold'); // Set to bold for wedding time
  doc.text(
    `${clientDetails.weddingTime}.`,
    25 + doc.getTextWidth(`• Wedding Time: `),
    164
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal

  // Reservations and Fittings
  doc.text('2. Reservations and Fittings', 20, 174);
  doc.text(
    '• First appointment: The Lessee must book an appointment to select three (3) dresses',
    25,
    182
  );
  doc.text('to try on.', 28, 190);
  doc.text(
    '• Second appointment: An additional appointment is required before the wedding',
    25,
    198
  );
  doc.text(
    'to try on the dresses and finalize the choice of "The One."',
    28,
    206
  );

  // Payment and Conditions
  doc.text('3. Payment and Conditions', 20, 216);
  doc.setFont('helvetica', 'bold'); // Set to bold for payment details
  doc.text(`• Rental amount: `, 25, 224);
  doc.text(
    `${reservation.amount}.`,
    25 + doc.getTextWidth(`• Rental amount: `),
    224
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`• Advance: `, 25, 232);
  doc.setFont('helvetica', 'bold'); // Set to bold for advance
  doc.text(
    `MAD ${(reservation.advancePercentage * subtotal) / 100}`,
    25 + doc.getTextWidth(`• Advance: `),
    232
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(
    `(A non-refundable deposit of ${reservation.advancePercentage}% of the total amount is required at the`,
    25,
    240
  );
  doc.text(
    'time of reservation, regardless of the reason for cancellation.)',
    33,
    248
  );

  doc.text(`• Security deposit: `, 25, 256);
  doc.setFont('helvetica', 'bold'); // Set to bold for security deposit
  doc.text(
    `MAD ${(reservation.securityDepositPercentage * subtotal) / 100}`,
    25 + doc.getTextWidth(`• Security deposit: `),
    256
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(
    `(A refundable security deposit equivalent to ${reservation.securityDepositPercentage}% of the rental`,
    25,
    264
  );
  doc.text(
    'amount is mandatory, along with the ID. This deposit will be refunded subject to ',
    28,
    272
  );
  doc.text('the following usage conditions.', 28, 280);

  doc.addPage();
  // Rental Duration
  doc.text('4. Rental Duration', 20, 20);
  doc.text(
    'The maximum rental period is 24 hours (For clients outside Fès, the maximum duration is',
    25,
    28
  );
  doc.text(
    '72 hours). Any delay will result in the forfeiture of the security deposit.',
    25,
    36
  );

  // Liability for Damages
  doc.text('5. Liability for Damages', 20, 46);
  doc.text(
    'In case of damage or alteration to the dress, the security deposit will not be refunded. ',
    25,
    316
  );

  doc.text(
    'The Lessor reserves the right to charge additional fees depending on the extent of the damage.',
    25,
    54
  );

  // Important Dates
  doc.text('6. Important Dates', 20, 64);
  doc.text(`• Dress pickup date: `, 25, 72);
  doc.setFont('helvetica', 'bold'); // Set to bold for pickup date
  doc.text(
    `${reservation.pickupDate.split('T')[0]}.`,
    25 + doc.getTextWidth(`• Dress pickup date: `),
    72
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal
  doc.text(`• Dress return date: `, 25, 80);
  doc.setFont('helvetica', 'bold'); // Set to bold for return date
  doc.text(
    `${reservation.returnDate.split('T')[0]}.`,
    25 + doc.getTextWidth(`• Dress return date: `),
    80
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal

  // Social Media Content Sharing
  doc.text('7. Social Media Content Sharing', 20, 90);
  doc.text(
    'The Lessor requests permission to share photos of the bride wearing the dress on its',
    25,
    98
  );

  doc.text(
    'social media platforms for promotional purposes. Please check one option:',
    25,
    106
  );

  doc.text(`[  ] Yes, I authorize the sharing of photos.`, 25, 114);
  doc.text(
    `[  ] Yes, I authorize the sharing of photos but without showing my face.`,
    25,
    122
  );
  doc.text(`[  ] No, I do not authorize the sharing of photos.`, 25, 130);

  // Acceptance of Terms
  doc.text('8. Acceptance of Terms', 20, 140);
  doc.text(
    'By signing this contract, the Lessee acknowledges having read and agrees to the terms',
    25,
    148
  );

  doc.text('outlined herein.', 25, 156);
  doc.text(`Executed in Fès, on ${new Date().toLocaleDateString()}.`, 25, 164);

  doc.rect(20, 180, 170, 50); // Rectangle remains the same
  // Signatures
  doc.text('Signatures:', 25, 186);
  doc.text('The Lessor:', 25, 194);
  doc.text('Signature:', 25, 202);
  doc.addImage(signiture, 'PNG', 50, 200, 50, 30);
  doc.line(105, 180, 105, 230); // Adjusted line height if necessary
  doc.text('The Lessee:', 115, 194);
  doc.setFont('helvetica', 'bold'); // Set to bold for Lessee's signature
  doc.text(
    `Signature: ${clientDetails.name} ${clientDetails.surname}`,
    115,
    202
  );
  doc.setFont('helvetica', 'normal'); // Reset to normal

  // Save the PDF to trigger download
  doc.save(
    `${clientDetails.name} ${clientDetails.surname}'s wedding_dress_rental_contract.pdf`
  );
};

handleDownloadWeddingDressRentalContract.propTypes = {
  customerDetails: PropTypes.object,
};

export default handleDownloadWeddingDressRentalContract;
