import React from "react"
import PropTypes from "prop-types"
import Book from "./Book"
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import { useState } from 'react';

const Book_Search = (props)=> {

    //book search required props
    Book_Search.PropTypes = {
        storedBooks: PropTypes.array.isRequired,
        onUpdateShelf: PropTypes.func.isRequired
    }

    // state contains query of search and currently searched books
    let [q, set_query] = useState("");
    let [searched_books, set_searched_books] = useState([]);


    const update_query = (q) => {
        // first, set state with the query
        set_query(q);
        // search the BooksAPI if the search result is in our app's list
        BooksAPI.search(q).then((search_results) => {
            if (search_results && search_results.length > 0) {
                for (let x = 0; x < search_results.length; x++) {
                    for (let y = 0; y < props.storedBooks.length; y++) {
                        if (search_results[x].id === props.storedBooks[y].id) {
                            const shelfedBookIndex = props.storedBooks.findIndex((book) => book.id === search_results[x].id)
                            search_results[x].shelf = props.storedBooks[shelfedBookIndex].shelf
                        }
                    }
                }
            }
            set_searched_books(search_results);
        })
    }

    return <div className="search-books">
                <div className="search-books-bar">
                <Link className="close-search" to="/">Close</Link>
                <div className="search-books-input-wrapper">
                    <input  type="text" 
                            value={q}
                            placeholder="Search by title or author"
                            onChange={(event) => update_query(event.target.value)}/>
                </div>
            </div>
            <div className="search-books-results">
                <ol className="books-grid">
                    {searched_books &&
                    searched_books.length > 0 &&
                    searched_books.map((book) => (
                        <Book
                            key={book.id}
                            onUpdateShelf={props.onUpdateShelf}
                            bookItem={book}
                        />
                    ))}
                </ol>
            </div>
        </div>
}
export default Book_Search