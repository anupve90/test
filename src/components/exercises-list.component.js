import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const Exercise = (props) => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>
      <a href={"/edit/" + props.exercise._id}>
        edit
      </a>{" "}
      |{" "}
      <a
        href="#"
        onClick={() => {
          props.deleteExercise(props.exercise._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);
export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);
    this.exerciseList = this.exerciseList.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = { exercises: [],offset: 0, perPage: 5,currentPage: 0 };
  }
  componentDidMount() {
    axios
      .get("http://localhost:5000/exercises/")
      .then((response) => {
        this.setState({ exercises: response.data ,pageCount: Math.ceil(response.data.length / this.state.perPage),});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.filteredExercises()
    });

};
  
  handleInputChange(event) {
    this.setState({
      query: event.target.value
    });
  }

  get filteredExercises() {
    let searchString = this.state.query || "";
    let exercises = this.state.exercises;
    if (searchString.length > 0) {
      return exercises.filter((item) =>
        item.username.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    const pageBegin = this.currentPage || 0;
    const pageEnd = pageBegin +this.state.offset ||0;
    return exercises;
  }

  deleteExercise(id) {
    axios.delete("http://localhost:5000/exercises/" + id).then((response) => {
      console.log(response.data);
    });
    this.setState({
      exercises: this.state.exercises.filter((el) => el._id !== id)
    });
  }
  exerciseList() {
    return this.filteredExercises.map((currentexercise) => {
      return (
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
      );
    });
  }
  render() {
    return (
      <div>
        <h3>Logged Exercises</h3>
        <form>
          <input
            type="text"
            className="form-control"
            id="filter"
            placeholder="Search for..."
            onChange={this.handleInputChange}
          />
        </form>
        <br></br>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.exerciseList()}</tbody>
        </table>
        <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={10}
                    pageRangeDisplayed={15}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
      </div>
    );
  }
}
