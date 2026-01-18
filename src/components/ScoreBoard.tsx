// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Autosuggest from 'react-autosuggest'
import { BATTING, OUT } from '../constants/BattingStatus'
import MathUtil from '../util/MathUtil'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faPencil, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'

const ScoreBoard = () => {
  const [inningNo, setInningNo] = useState(1)
  const [match, setMatch] = useState({ inning1: { batters: [], bowlers: [] }, inning2: { batters: [], bowlers: [] } })
  const [currentRunStack, setCurrentRunStack] = useState([])
  const [totalRuns, setTotalRuns] = useState(0)
  const [extras, setExtras] = useState({ total: 0, wide: 0, noBall: 0 })
  const [runsByOver, setRunsByOver] = useState(0)
  const [wicketCount, setWicketCount] = useState(0)
  const [totalOvers, setTotalOvers] = useState(0)
  const [batters, setBatters] = useState([])
  const [ballCount, setBallCount] = useState(0)
  const [overCount, setOverCount] = useState(0)
  const [batter1, setBatter1] = useState({})
  const [batter2, setBatter2] = useState({})
  const [battingOrder, setBattingOrder] = useState(0)
  const [isBowlerEdited, setBowlerEdited] = useState(false)
  const [bowler, setBowler] = useState({})
  const [bowlers, setBowlers] = useState([])
  const [inputBowler, setInputBowler] = useState('')
  const [remainingBalls, setRemainingBalls] = useState(0)
  const [remainingRuns, setRemainingRuns] = useState(0)
  const [strikeValue, setStrikeValue] = React.useState('strike')
  const [isNoBall, setNoBall] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [hasNameSuggested, setNameSuggested] = useState(false)
  const [hasMatchEnded, setMatchEnded] = useState(false)

  let data
  const history = useHistory()

  const dataString = localStorage.getItem('data')
  if (!dataString) {
    history.push('/')
    return null
  }
  data = JSON.parse(dataString)
  const { batting, team1, team2 } = data
  const maxOver = parseInt(data.maxOver)

  useEffect(() => {
    const endInningButton = document.getElementById('end-inning')
    endInningButton.disabled = true
  }, [])

  const handleEndInning = (e) => {
    const endInningButton = document.getElementById('end-inning')
    if (endInningButton.textContent === 'Reset') {
      history.push('/')
    } else {
      if (batter1.id !== undefined) {
        const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1
        batters.push({
          id,
          name,
          run,
          ball,
          four,
          six,
          strikeRate,
          onStrike,
          battingOrder: batter1.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (batter2.id !== undefined) {
        batters.push({
          id: batter2.id,
          name: batter2.name,
          run: batter2.run,
          ball: batter2.ball,
          four: batter2.four,
          six: batter2.six,
          strikeRate: batter2.strikeRate,
          onStrike: batter2.onStrike,
          battingOrder: batter2.battingOrder,
          battingStatus: BATTING,
        })
      }
      if (bowler.id !== undefined) {
        const currentDisplayOver = Math.round((ballCount === 6 ? 1 : ballCount * 0.1) * 10) / 10
        let isMaidenOver = true
        let countWicket = 0
        let countNoBall = 0
        let countWide = 0
        const deliveries = ['1', '2', '3', '4', '6', 'wd']
        for (let delivery of currentRunStack) {
          delivery = delivery.toString()
          if (deliveries.includes(delivery) || delivery.includes('nb')) {
            isMaidenOver = false
          }
          if (delivery === 'W') {
            countWicket++
          }
          if (delivery.includes('nb')) {
            countNoBall++
          }
          if (delivery.includes('wd')) {
            countWide++
          }
        }
        if (ballCount !== 6) {
          isMaidenOver = false
        }
        const index = bowlers.findIndex((blr) => {
          return blr.id === bowler.id
        })
        if (index !== -1) {
          const existingBowler = bowlers[index]
          const { maiden, wicket, noBall, wide, over } = existingBowler
          const bowlerTotalOver = over + ballCount / 6
          existingBowler.over = existingBowler.over + currentDisplayOver
          existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
          existingBowler.run = existingBowler.run + runsByOver
          existingBowler.wicket = wicket + countWicket
          existingBowler.noBall = noBall + countNoBall
          existingBowler.wide = wide + countWide
          existingBowler.economy = Math.round((existingBowler.run / bowlerTotalOver) * 100) / 100
          bowlers[index] = existingBowler
          setBowlers(bowlers)
        } else {
          if (ballCount !== 6) {
            bowlers.push({
              id: bowler.id,
              name: bowler.name,
              over: currentDisplayOver,
              maiden: isMaidenOver ? 1 : 0,
              run: runsByOver,
              wicket: countWicket,
              noBall: countNoBall,
              wide: countWide,
              economy: Math.round((runsByOver / (ballCount / 6)) * 100) / 100,
            })
            setBowlers(bowlers)
          }
        }
      }
      if (inningNo === 1) {
        setMatch((state) => {
          const totalFours = batters.map((batter) => batter.four).reduce((prev, next) => prev + next, 0)
          const totalSixes = batters.map((batter) => batter.four).reduce((prev, next) => prev + next, 0)
          return {
            ...state,
            inning1: {
              runs: totalRuns,
              wickets: wicketCount,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extra: extras,
              batters,
              bowlers,
            },
          }
        })
        setInningNo(2)
        setCurrentRunStack([])
        setTotalRuns(0)
        setExtras({ total: 0, wide: 0, noBall: 0 })
        setRunsByOver(0)
        setWicketCount(0)
        setTotalOvers(0)
        setBallCount(0)
        setOverCount(0)
        setBatter1({})
        setBatter2({})
        setBatters([])
        setBowlers([])
        setBattingOrder(0)
        setInputBowler('')
        setBowler({})
        setRemainingBalls(maxOver * 6)
        setRemainingRuns(totalRuns + 1)
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = false
        setStrikeValue('strike')
        endInningButton.disabled = true
      } else {
        setMatch((state) => {
          const totalFours = batters.map((batter) => batter.four).reduce((prev, next) => prev + next, 0)
          const totalSixes = batters.map((batter) => batter.four).reduce((prev, next) => prev + next, 0)
          return {
            ...state,
            inning2: {
              runs: totalRuns,
              wickets: wicketCount,
              overs: totalOvers,
              four: totalFours,
              six: totalSixes,
              extra: extras,
              batters,
              bowlers,
            },
          }
        })
        endInningButton.textContent = 'Reset'
        setMatchEnded(true)
      }
    }
  }
  const handleBowlerBlur = (e) => {
    let name = e.target.value
    if (name !== '') {
      name = name.charAt(0).toUpperCase() + name.slice(1)
      setInputBowler(name)
      e.target.value = name
      e.target.disabled = true
      if (isBowlerEdited) {
        setBowler((state) => ({
          ...state,
          name: name,
        }))
        setBowlerEdited(false)
      } else {
        if (hasNameSuggested) {
          setNameSuggested(false)
        } else {
          const randomNo = MathUtil.getRandomNo()
          const id = name + randomNo
          setBowler({
            id,
            name,
          })
        }
      }
    }
  }
  const onSuggestionsFetchRequested = (param) => {
    const inputValue = param.value.trim().toLowerCase()
    const suggestionArr = inputValue.length === 0 ? [] : bowlers.filter((bowlerObj) => bowlerObj.name.toLowerCase().includes(inputValue))
    setSuggestions(suggestionArr)
  }
  const getSuggestionValue = (suggestion) => {
    setBowler({
      id: suggestion.id,
      name: suggestion.name,
    })
    setNameSuggested(true)
    return suggestion.name
  }
  const inputProps = {
    value: inputBowler,
    onChange: (e, { newValue }) => {
      setInputBowler(newValue)
    },
    onBlur: handleBowlerBlur,
  }
  const overCompleted = (runsByOverParam, currentRunStackParam) => {
    const bowlerNameElement = document.querySelector('.react-autosuggest__input')
    if (overCount + 1 === maxOver) {
      const endInningButton = document.getElementById('end-inning')
      endInningButton.disabled = false
    } else {
      bowlerNameElement.disabled = false
    }
    disableAllScoreButtons()
    setInputBowler('')
    setBowler({})
    setCurrentRunStack([])
    setRunsByOver(0)
    setBallCount(0)
    setOverCount(overCount + 1)
    const index = bowlers.findIndex((blr) => blr.id === bowler.id)
    let isMaidenOver = true
    let countWicket = 0
    let countNoBall = 0
    let countWide = 0
    const deliveries = ['1', '2', '3', '4', '6', 'wd']
    for (let delivery of currentRunStackParam) {
      delivery = delivery.toString()
      if (deliveries.includes(delivery) || delivery.includes('nb')) {
        isMaidenOver = false
      }
      if (delivery === 'W') {
        countWicket++
      }
      if (delivery.includes('nb')) {
        countNoBall++
      }
      if (delivery.includes('wd')) {
        countWide++
      }
    }
    if (index !== -1) {
      const existingBowler = bowlers[index]
      const { over, maiden, run, wicket, noBall, wide } = existingBowler
      existingBowler.over = over + 1
      existingBowler.maiden = isMaidenOver ? maiden + 1 : maiden
      existingBowler.run = run + runsByOverParam
      existingBowler.wicket = wicket + countWicket
      existingBowler.noBall = noBall + countNoBall
      existingBowler.wide = wide + countWide
      existingBowler.economy = Math.round((existingBowler.run / existingBowler.over) * 100) / 100
      bowlers[index] = existingBowler
      setBowlers(bowlers)
    } else {
      setBowlers((state) => [
        ...state,
        {
          id: bowler.id,
          name: bowler.name,
          over: 1,
          maiden: isMaidenOver ? 1 : 0,
          run: runsByOverParam,
          wicket: countWicket,
          noBall: countNoBall,
          wide: countWide,
          economy: runsByOverParam,
        },
      ])
    }
  }
  const newBatter1 = () => {
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter1
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter1.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter1({})
  }
  const newBatter2 = () => {
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter2
    setBatters((state) => [
      ...state,
      {
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter2.battingOrder,
        battingStatus: OUT,
      },
    ])
    setBatter2({})
  }
  const editBowlerName = () => {
    if (overCount !== maxOver && wicketCount !== 10 && !hasMatchEnded) {
      const bowlerNameElement = document.querySelector('.react-autosuggest__input')
      bowlerNameElement.disabled = false
      setBowlerEdited(true)
    }
  }
  const undoWicket = (isNoBallParam) => {
    if (!isNoBallParam) {
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
    }
    setWicketCount(wicketCount - 1)
    const batter = batters[batters.length - 1]
    const { id, name, run, ball, four, six, strikeRate, onStrike } = batter
    if (batter1.name === undefined || batter1.onStrike) {
      setBatter1({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        setBatter2((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    } else if (batter2.name === undefined || batter2.onStrike) {
      setBatter2({
        id,
        name,
        run,
        ball,
        four,
        six,
        strikeRate,
        onStrike,
        battingOrder: batter.battingOrder,
        battingStatus: BATTING,
      })
      if (!batter.onStrike) {
        setBatter1((state) => ({
          ...state,
          onStrike: true,
        }))
      }
    }
    batters.pop()
    setBatters(batters)
  }
  const undoRun = (run, isNoBallParam) => {
    if (isNoBallParam) {
      setTotalRuns(totalRuns - (run + 1))
      setRunsByOver(runsByOver - (run + 1))
    } else {
      setTotalRuns(totalRuns - run)
      setRunsByOver(runsByOver - run)
      setBallCount(ballCount - 1)
      setTotalOvers(Math.round((totalOvers - 0.1) * 10) / 10)
      currentRunStack.pop()
      setCurrentRunStack(currentRunStack)
    }
    if (batter1.onStrike) {
      if (run % 2 === 0) {
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    } else if (batter2.onStrike) {
      if (run % 2 === 0) {
        setBatter2((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      } else {
        setBatter1((state) => {
          const updatedRun = state.run - run
          const updatedBall = state.ball - 1
          const updatedSr = updatedRun / updatedBall
          const sr = Math.round(isNaN(updatedSr) ? 0 : updatedSr * 100 * 100) / 100
          let four = state.four
          if (run === 4) {
            four = four - 1
          }
          let six = state.six
          if (run === 6) {
            six = six - 1
          }
          return {
            ...state,
            run: updatedRun,
            ball: updatedBall,
            four: four,
            six: six,
            strikeRate: sr,
          }
        })
      }
    }
  }
  const undoDelivery = () => {
    if (currentRunStack.length > 0) {
      const last = currentRunStack[currentRunStack.length - 1]
      if (typeof last === 'number') {
        const run = parseInt(last)
        undoRun(run, false)
      } else {
        currentRunStack.pop()
        setCurrentRunStack(currentRunStack)
        if (last === 'wd') {
          setTotalRuns(totalRuns - 1)
          setExtras((state) => ({
            ...state,
            total: state.total - 1,
            wide: state.wide - 1,
          }))
        } else if (last === 'W') {
          undoWicket(false)
        } else {
          const lastChar = last.substr(last.length - 1)
          const run = parseInt(lastChar)
          if (isNaN(run)) {
            setTotalRuns(totalRuns - 1)
            setRunsByOver(runsByOver - 1)
            if (last !== 'nb') {
              undoWicket(true)
            }
          } else {
            undoRun(run, true)
          }
        }
      }
    }
  }


  const handleRun = (run) => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, 'nb' + run])
      removeNoBallEffect()
    } else {
      setBallCount(ballCount + 1)
      setCurrentRunStack((state) => [...state, run])
    }
    setTotalRuns(totalRuns + run)
    setRunsByOver(runsByOver + run)
    if (inningNo === 2) {
      if (!isNoBall) {
        setRemainingBalls(remainingBalls - 1)
      }
      setRemainingRuns(remainingRuns - run)
    }
    if (ballCount === 5) {
      if (isNoBall) {
        if (run % 2 !== 0) {
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push(run)
        overCompleted(runsByOver + run, arr)
        if (run % 2 === 0) {
        }
      }
    } else {
      if (!isNoBall) {
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
      }
      if (run % 2 !== 0) {
      }
    }
    if (batter1.onStrike) {
      setBatter1((state) => {
        const updatedRun = state.run + run
        const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if (isNoBall) {
        if (run % 2 !== 0) {
        }
      } else {
        if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
        }
      }
    } else {
      setBatter2((state) => {
        const updatedRun = state.run + run
        const updatedBall = state.ball + 1
        const sr = Math.round((updatedRun / updatedBall) * 100 * 100) / 100
        let four = state.four
        if (run === 4) {
          four = four + 1
        }
        let six = state.six
        if (run === 6) {
          six = six + 1
        }
        return {
          ...state,
          run: updatedRun,
          ball: updatedBall,
          four: four,
          six: six,
          strikeRate: sr,
        }
      })
      if ((ballCount === 5 && run % 2 === 0) || (ballCount !== 5 && run % 2 !== 0)) {
      }
    }
  }
  const handleNoBall = () => {
    if (inningNo === 2) {
      setRemainingRuns(remainingRuns - 1)
    }
    setTotalRuns(totalRuns + 1)
    setRunsByOver(runsByOver + 1)
    setExtras((state) => ({
      ...state,
      total: state.total + 1,
      noBall: state.noBall + 1,
    }))
    addNoBallEffect()
  }
  const addNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.add('score-types-button-noball')
    }
    setNoBall(true)
  }
  const removeNoBallEffect = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].classList.remove('score-types-button-noball')
    }
    setNoBall(false)
  }
  const handleWide = () => {
    if (isNoBall) {
      setCurrentRunStack((state) => [...state, 'nb'])
      removeNoBallEffect()
    } else {
      if (inningNo === 2) {
        setRemainingRuns(remainingRuns - 1)
      }
      setCurrentRunStack((state) => [...state, 'wd'])
      setTotalRuns(totalRuns + 1)
      setRunsByOver(runsByOver + 1)
      setExtras((state) => ({
        ...state,
        total: state.total + 1,
        wide: state.wide + 1,
      }))
    }
  }
  const handleWicket = (isRunOut, playerId) => {
    if (ballCount === 5) {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setTotalOvers(overCount + 1)
        const arr = [...currentRunStack]
        arr.push('W')
        overCompleted(runsByOver, arr)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    } else {
      if (isNoBall) {
        removeNoBallEffect()
        if (isRunOut) {
          setCurrentRunStack((state) => [...state, 'nbW'])
          setWicketCount(wicketCount + 1)
          disableAllScoreButtons()
        } else {
          setCurrentRunStack((state) => [...state, 'nb'])
        }
      } else {
        setBallCount(ballCount + 1)
        setCurrentRunStack((state) => [...state, 'W'])
        setTotalOvers(Math.round((totalOvers + 0.1) * 10) / 10)
        setWicketCount(wicketCount + 1)
        disableAllScoreButtons()
      }
    }
    if (isRunOut) {
      if (batter1.id === playerId) {
        newBatter1()
      } else {
        newBatter2()
      }
    } else {
      if (!isNoBall) {
        if (batter1.onStrike) {
          newBatter1()
        } else {
          newBatter2()
        }
      }
    }
    if (isNoBall) {
      if (isRunOut && wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        setInputBowler('')
      }
    } else {
      if (wicketCount + 1 === 10) {
        const endInningButton = document.getElementById('end-inning')
        endInningButton.disabled = false
        const bowlerNameElement = document.querySelector('.react-autosuggest__input')
        bowlerNameElement.disabled = true
        setInputBowler('')
      }
    }
  }
  const endMatch = () => {
    disableAllScoreButtons()
    const endInningButton = document.getElementById('end-inning')
    if (endInningButton.textContent === 'Score Board') {
      endInningButton.disabled = false
    }
  }
  const disableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = true
    }
  }
  const enableAllScoreButtons = () => {
    const scoreTypesButtons = document.querySelectorAll('.score-types-button')
    for (let i = 0; i < scoreTypesButtons.length; i++) {
      scoreTypesButtons[i].disabled = false
    }
  }
  if (inputBowler !== '') {
    enableAllScoreButtons()
  }
  const overs = overCount + ballCount / 6
  const inning1 = match.inning1
  const inning2 = match.inning2
  const scoringTeam = batting === team1 ? team1 : team2
  const chessingTeam = scoringTeam === team1 ? team2 : team1
  let winningMessage = `${inningNo === 1 ? scoringTeam : chessingTeam} needs ${remainingRuns} ${remainingRuns <= 1 ? 'run' : 'runs'
    } in ${remainingBalls} ${remainingBalls <= 1 ? 'ball' : 'balls'} to win`
  if (inningNo === 2) {
    var target = inning1.runs + 1
    if (wicketCount < 10 && overCount <= maxOver && totalRuns >= target) {
      winningMessage = `${chessingTeam} won by ${10 - wicketCount} wickets`
      endMatch()
    }
    if ((wicketCount >= 10 || overCount >= maxOver) && totalRuns < target - 1) {
      winningMessage = `${scoringTeam} won by ${target - totalRuns - 1} runs`
      endMatch()
    }
    if (wicketCount < 10 && overCount === maxOver && totalRuns === target - 1) {
      winningMessage = 'Match Tied'
      endMatch()
    }
  }
  const welcomeContent = (
    <>
      <div></div>
      <div>Welcome to CricBio Score Board</div>
      <div></div>
    </>
  )
  const firstInningCompletedContent = (
    <>
      {overCount === maxOver && <div>1st inning completed</div>}
      {wicketCount === 10 && <div>All Out</div>}
      <div>Please click "End Inning" button</div>
    </>
  )
  const remainingRunsContent = (
    <>
      <div>Target: {target}</div>
      <div>{winningMessage}</div>
    </>
  )
  return (
    <div className="container mx-auto max-w-xl space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-2 text-white rounded-lg shadow-md">
        <div className="font-semibold">
          {team1} vs {team2}, {inningNo === 1 ? '1st' : '2nd'} Inning
        </div>
        <div>
          <button
            id="end-inning"
            className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            onClick={handleEndInning}
          >
            {inningNo === 1 ? 'End Inning' : 'Score Board'}
          </button>
        </div>
      </div>

      {/* Badge */}
      <div
        id="badge"
        className="flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-400 px-3 py-2 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      >
        {inningNo === 2
          ? remainingRunsContent
          : overCount === maxOver || wicketCount === 10
            ? firstInningCompletedContent
            : welcomeContent}
      </div>

      {/* Main Score Card */}
      <div className="bg-white p-3 rounded-xl shadow-lg space-y-3">

        {/* Score Header */}
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 text-white shadow-lg">
          <div className="flex flex-col gap-1.5">
            <div className="text-[0.95rem] font-bold opacity-95">
              {inningNo === 1 ? scoringTeam : chessingTeam}
            </div>
            <div className="text-[4.2rem] tracking-wide">
              <span className="text-white">{totalRuns}</span>/
              <span className="text-yellow-400 ml-1">{wicketCount}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[1rem] opacity-85 text-white">
              over
              <span className="block text-[1.5rem] text-white">
                ({totalOvers})
              </span>
            </div>
          </div>
        </div>

        {/* Bowler Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-indigo-100/40 p-2 rounded-lg shadow-inner justify-between">
            <span className="font-semibold">Bowler:</span>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={() => setSuggestions([])}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
              inputProps={inputProps}
            />
            <FontAwesomeIcon
              icon={faPencil}
              className="text-gray-700 text-xl px-1 cursor-pointer hover:text-gray-900"
              onClick={editBowlerName}
            />
          </div>

          {/* Current Run Stack */}
          <div className="grid grid-cols-3 gap-4 p-2 rounded-lg bg-gray-50 shadow-sm">
            {currentRunStack.map((run, i) => (
              <span key={i} className="text-center font-semibold text-gray-800 px-1 bg-blue-100">
                {run}
              </span>
            ))}
            <FontAwesomeIcon
              icon={faTrash}
              className="text-yellow-400 text-xl cursor-pointer hover:text-yellow-500"
              onClick={undoDelivery}
            />
          </div>
        </div>

        {/* Score Buttons */}
        <div className="grid max-w-[360px] grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Dot', onClick: () => handleRun(0) },
            { label: 'Wide', onClick: handleWide },
            { label: 'No Ball', onClick: handleNoBall },
            { label: '1', onClick: () => handleRun(1) },
            { label: '2', onClick: () => handleRun(2) },
            { label: '3', onClick: () => handleRun(3) },
            { label: '4', onClick: () => handleRun(4) },
            { label: '6', onClick: () => handleRun(6) },
            { label: 'W', onClick: () => handleWicket(false, '') },
          ].map((btn, i) => (
            <div
              key={i}
              onClick={btn.onClick}
              className="flex items-center justify-center h-12 rounded-lg bg-blue-100 hover:bg-blue-200 text-center font-bold cursor-pointer shadow-sm transition-all duration-150 active:scale-95"
            >
              {btn.label}
            </div>
          ))}
        </div>

        {/* Extras */}
        <div className="flex justify-between items-center gap-2 p-2 mt-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-800 shadow-inner">
          <div>Extras: {extras.total}</div>
          <div>Wd: {extras.wide}</div>
          <div>NB: {extras.noBall}</div>
        </div>

      </div>
    </div>

  )
}

export default ScoreBoard
