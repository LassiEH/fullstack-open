import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>
        {props.text}
      </td>
      <td>
        {props.value}
      </td>
    </tr>
  )
}

const Statistics = (props) => { if (props.all === 0) {
  return (
    <div>
      No feedback given
    </div>
  )
}
  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text='good:' value={props.good}/>
          <StatisticsLine text='neutral:' value={props.neutral}/>
          <StatisticsLine text='bad:' value={props.bad}/>
          <StatisticsLine text='all:' value={props.all}/>
          <StatisticsLine text='average:' value={props.avg}/>
          <StatisticsLine text='positive:' value={props.pos}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [score, setScore] = useState(0)
  const [avg_percent, setAvg] = useState(0)
  const [pos_percent, setPos] = useState(0)

  const handleGood = () => {
    const updatedGood = good + 1
    const updatedAll = all + 1
    const updatedScore = score + 1
    const updatedAvg = updatedScore / updatedAll
    const updatedPos = updatedGood / updatedAll
    setGood(updatedGood)
    setAll(updatedAll)
    setScore(updatedScore)
    setAvg(updatedAvg)
    setPos(updatedPos)
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    const updatedAll = all + 1
    const updatedScore = score - 1
    const updatedAvg = updatedScore / updatedAll
    const updatedPos = good / updatedAll
    setBad(updatedBad)
    setAll(updatedAll)
    setScore(updatedScore)
    setAvg(updatedAvg)
    setPos(updatedPos)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    const updatedAll = all + 1
    const updatedAvg = score / updatedAll
    const updatedPos = good / updatedAll
    setNeutral(updatedNeutral)
    setAll(updatedAll)
    setAvg(updatedAvg)
    setPos(updatedPos)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={handleGood} text='Good'/>
      <Button handleClick={handleNeutral} text='Neutral'/>
      <Button handleClick={handleBad} text='Bad'/>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral}
       bad={bad} all={all} avg={avg_percent} pos={pos_percent*100}/>
    </div>
  )
}

export default App