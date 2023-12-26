const mongoose = require('mongoose');

// Define the books schema
const bookSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
  issuedAt: { type: Date, default: Date.now},
  forDays: { type: String},
  shouldBeReturnOn: { type: Date, default: null },
  onRealItReturned: { type: Date, default: null },
  isLateToSubmit: { type: Boolean, default: false },
  daysLeft: { type: String, default: -1 },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  books: [bookSchema],
});

// Helper function to calculate days left until return
// const calculateDaysLeft = (returnDate, currentDate) =>
//   Math.max(0, Math.ceil((returnDate - currentDate) / (24 * 60 * 60 * 1000)));

// // Pre-save hook for the user schema
// userSchema.pre('save', function (next) {
//   console.log('Pre-save hook is being called!');
//   const currentDate = new Date();

//   this.books.forEach((book) => {
//     const issuedDate = new Date(book.issuedAt);
//     const forDays = parseInt(book.forDays) || 1;

//     const returnDate = new Date(issuedDate);
//     returnDate.setDate(returnDate.getDate() + forDays);
//     book.shouldBeReturnOn = returnDate;

//     book.isLateToSubmit = currentDate > returnDate;
//     book.daysLeft = calculateDaysLeft(returnDate, currentDate);

//     // Ensure daysLeft cannot go beyond -1
//     book.daysLeft = Math.max(book.daysLeft, -1);

//     // Ensure onRealItReturned is initially set to null
//     book.onRealItReturned = book.onRealItReturned || null;
//   });

//   next();
// });

// Pre-update hook for the user schema
// userSchema.pre('updateOne', function (next) {
//   console.log('Pre-update hook is being called!');
//   const currentDate = new Date();
  
//   // Access the document being updated using the 'doc' parameter
//   const books = this.getUpdate().$set.books;

//   if (books && Array.isArray(books)) {
//     books.forEach((book) => {
//       const issuedDate = new Date(book.issuedAt);
//       const forDays = parseInt(book.forDays) || 1;

//       const returnDate = new Date(issuedDate);
//       returnDate.setDate(returnDate.getDate() + forDays);
//       book.shouldBeReturnOn = returnDate;

//       book.isLateToSubmit = currentDate > returnDate;
//       book.daysLeft = calculateDaysLeft(returnDate, currentDate);

//       // Ensure daysLeft cannot go beyond -1
//       book.daysLeft = Math.max(book.daysLeft, -1);

//       // Ensure onRealItReturned is initially set to null
//       book.onRealItReturned = book.onRealItReturned || null;
//     });
//   }

//   next();
// });

// // Update isLateToSubmit and daysLeft fields on a daily basis if onRealItReturned is null
// setInterval(async function () {
//   try {
//     const users = await User.find();
//     users.forEach((user) => {
//       user.books.forEach((book) => {
//         if (book.onRealItReturned === null) {
//           const currentDate = new Date();
//           book.isLateToSubmit = currentDate > book.shouldBeReturnOn;
//           book.daysLeft = calculateDaysLeft(book.shouldBeReturnOn, currentDate);

//           // Ensure daysLeft cannot go beyond -1
//           book.daysLeft = Math.max(book.daysLeft, -1);
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Error updating isLateToSubmit and daysLeft:', error.message);
//   }
// }, 24 * 60 * 60 * 1000); // Update every 24 hours

const User = mongoose.model('User', userSchema);  // Add this line

module.exports = User;
