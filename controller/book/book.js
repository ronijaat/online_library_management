const Book = require("../../model/book");
const Admin = require("../../model/auth");
const User = require("../../model/user");
const Transaction = require("../../model/trans")

const addBook = async (req, res) => {
  try {
    const email = req.currentUser.email;
    const { title, author, count, url } = req.body;
    if (!title || !author || !count || !url) {
      return res.status(400).json({ message: "insufficient data" });
    }
    const user = await Admin.findOne({ email });
    const addBy = user.name;
    const parseCount = await parseInt(count);
    console.log(addBy);
    const newBook = new Book({ title, author, count:parseCount, url, addBy });
    const book = await newBook.save();
    return res.status(200).json(book);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

const allBooks = async (req, res) => {
  try {
    const { skipbooks } = req.body;
    const books = await Book.find({}).skip(parseInt(skipbooks)).limit(10);
    //console.log(books)
    return res.status(200).json(books);
  } catch (e) {
    return res.status(500).json({ message: "Server Error" });
  }
};
const singleBook = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.find({ _id: id });
    console.log(book);
    const users = await User.find({});
    return res.status(200).json({ book, users });
  } catch (e) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const assignBook = async (req, res) => {
  try {
    const { id, email, startDate } = req.body;
    console.log(startDate);
    const date = new Date(startDate)
    console.log(date);


    // Check if the book exists
    const book = await Book.findOne({ _id: id });
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }
    if(book.count < 1){
      return res.status(409).json({message:"No copies left in this book."})
    }
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user's books array with the new book
    user = await User.findOneAndUpdate(
      { email, books: { $not: { $elemMatch: { bookId: id } } } }, // Check if bookId doesn't exist in the array
      { $push: { books: { bookId: id, shouldBeReturnOn:date } } },
      { new: true } // Return the updated document
    );
    if (user) {
      await Book.findOneAndUpdate(
        { _id: id },
        { $inc: { count: -1 } }
      );
      const trans = new Transaction({user:user._id,book:book._id,dueDate:date,transactionType:"borrowed"})
      await trans.save();
      return res.status(200).json({ message: "Book added successfully", user });
    } else {
      return res.status(400).json({ message: "Book Already Exits" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Remove the book reference from users' book arrays
    const users = await User.updateMany(
      { "books.bookId": bookId },
      { $pull: { books: { bookId: bookId } } }
    );

    return res.status(200).json({ message: "Book deleted successfully", deletedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    console.log("Request received:", userId, bookId);

    // Check if the user exists
    let user = await User.findOne({ _id: userId });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User Not Found" });
    }

    // Check if the book exists
    let book = await Book.findOne({ _id: bookId });
    if (!book) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book is not available" });
    }

    // Update the isReturned field to true in the user's books array
    await User.updateOne(
      { _id: userId, "books.bookId": bookId },
      { $set: { "books.$.isLateToSubmit": true } }
    );

    // Increment the count of the book by 1
    await Book.findOneAndUpdate({ _id: bookId }, { $inc: { count: 1 } });

    // Use the current date and time for the returned transaction
    const currentDate = new Date();

    // Create a new transaction for the return
    const trans = new Transaction({
      user: userId,
      book: bookId,
      dueDate: currentDate,
      transactionType: "returned",
    });

    await trans.save();

    console.log("Book returned successfully");
    return res.status(200).json({ message: "Book Return successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};






module.exports = {
  addBook,
  allBooks,
  singleBook,
  assignBook,
  deleteBook,
  returnBook
};
