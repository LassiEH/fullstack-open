import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const MostVoted = (props) => {
  const allVotesZero = props.votes.every(vote => vote === 0);

  if (allVotesZero) {
    return (
      <div>
        <h2>Anecdote with most votes</h2>
        <p>No feedback given</p>
      </div>
    );
  }

  const highest = props.votes.indexOf(Math.max(...props.votes))
  const chosenText = props.anecdotes[highest]

  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{chosenText}</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const nextAnecdote = () => {
    const rand = Math.floor(Math.random() * (anecdotes.length - 0))
    console.log(rand)
    setSelected(rand)
  }

  const vote = (votes, selected) => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    console.log(newVotes)
    setVotes(newVotes)
  }

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <Button handleClick={nextAnecdote} text='next anecdote' />
      <Button handleClick={() => vote(votes, selected)} text='vote' />
      <MostVoted votes={votes} anecdotes={anecdotes} />
    </div>
  )
}

export default App