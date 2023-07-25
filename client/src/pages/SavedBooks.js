import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// SavedBooks component definition
const SavedBooks = () => {
  // Fetching user data from the server using Apollo useQuery hook
  const { loading, data } = useQuery(GET_ME);
  const [deleteBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  // Display a message if the user is not logged in
  if (!userData?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  // Function to handle book deletion from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: { bookId: bookId },
        // Updating the cache to remove the deleted book
        update: cache => {
          const data = cache.readQuery({ query: GET_ME });
          const userDataCache = data.me;
          const savedBooksCache = userDataCache.savedBooks;
          const updatedBookCache = savedBooksCache.filter((book) => book.bookId !== bookId);
          data.me.savedBooks = updatedBookCache;
          cache.writeQuery({ query: GET_ME, data: { data: { ...data.me.savedBooks } } })
        }
      });
      // Upon success, remove the book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Display a loading message if data isn't available yet
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Rendering the SavedBooks component
  return (
    <>
      {/* Jumbotron for the heading */}
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {/* Displaying the number of saved books */}
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {/* Mapping through saved books to display each one in a Card */}
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {/* Displaying the book's image if available */}
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  {/* Displaying a link to more information on Google Books */}
                  {book.link ? <Card.Text><a href={book.link} target="_blank">More Information on Google Books</a></Card.Text> : null}
                  <Card.Text>{book.description}</Card.Text>
                  {/* Button to delete the book */}
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
