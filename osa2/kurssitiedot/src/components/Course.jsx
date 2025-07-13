const Course = ({ course }) => {
    console.log(course)
    return (
      <div>
        <Header course = {course} />
        <Content course = {course} />
        <Total course = {course} />
      </div>
    )
  }
  
  const Header = ({ course }) => {
    return (
      <div>
        <h2>{course.name}</h2>
      </div>
    )
  }
  
  const Content = ( {course} ) => {
    console.log(course)
    return (
      <div>
        {course.parts.map((part) => (
          <Part key ={part.id} name={part.name} number={part.exercises} />
        ))}
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>{props.name} {props.number}</p>
      </div>
    )
  }
  
  const Total = ( {course} ) => {
    const exercises = course.parts.map(part => part.exercises)
    const value = 0
    const sum = exercises.reduce(
      (raisedBy, valueNow) => raisedBy + valueNow,
      value,
    );
    return (
      <div>
        <h4>Number of exercises {sum} </h4>
      </div>
    )
  }

  export default Course