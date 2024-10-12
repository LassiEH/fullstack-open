const Header = (props) => {
  return (
    <div>
      <h1>{props.header}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.name} number={props.number}/>
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

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.firstNum + props.secondNum + props.thirdNum}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header header={course}/>
      <Content name={parts[0].name} number={parts[0].exercises}/>
      <Content name={parts[1].name} number={parts[1].exercises}/>
      <Content name={parts[2].name} number={parts[2].exercises}/>
      <Total firstNum={parts[0].exercises} secondNum={parts[1].exercises} thirdNum={parts[2].exercises}/>
    </div>
  )
}

export default App
