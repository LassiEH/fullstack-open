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
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header header={course}/>
      <Content name={part1} number={exercises1}/>
      <Content name={part2} number={exercises2}/>
      <Content name={part3} number={exercises3}/>
      <Total firstNum={exercises1} secondNum={exercises2} thirdNum={exercises3}/>
    </div>
  )
}

export default App
