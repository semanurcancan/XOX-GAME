import { render } from '@testing-library/react';
import './input.css';
import { useEffect, useState } from "react";
import { VscDebugRestart } from 'react-icons/vsc';


import React from 'react'
import Confetti from 'react-confetti'




function App() {

  const width = window.innerWidth
  const height = window.innerHeight

  const initialState = ["", "", "", "", "", "", "", "", ""]
  const [gameArray, setGameArray] = useState(initialState)
  const [win, setWinState] = useState(false);
  const [player, setPlayer] = useState(1);
  const [vsAI, setVsAI] = useState(0)

  //tüm stateler başlangıç değerine dondurulup, Oyun yeniden başlatılır.
  const restartGame = () => {
    setGameArray(initialState)
    setWinState(false)
    setPlayer(1)
    setVsAI(0)
  }

  //BİLGİSAYARA KARŞI
  //boş alanların indexlerini bulduk
  function availableSpaces() {
    let spaces = []
    gameArray.forEach((item, index) => {
      if (item == "") {
        spaces.push(index)
      }
    })
    return spaces

  }
  //AI oyuncu birin yerine "O" koyuyor. oyuncu birin kazanıp kazanmadığına bakıyor.eğer kazanıyor ise bu hamlenin onu gecmek için aynı index'e kendi symbol ünü koyuyor.

  function calculateMove() {
    let available = availableSpaces()

    for (let i = 0; i < available.length; i++) {
      let board = [...gameArray]
      board[available[i]] = "O"
      if (checkWin(board)) {
        return available[i]
      }
      board[available[i]] = "X"
      if (checkWin(board)) {
        return available[i]

      }
    }
    return available[0]
  }

  //Click durmundan sonra oyuncu ikiye setleniyor oyun, 2.oyuncunun hamlesinden sonra ise oyuncu bire setleniyor.
  const afterClick = (param) => {

    if (gameArray[param] != "" || win) {
      return
    }
    console.log(param + ".tıklandı")
    let symbol = "O"
    if (player == 1) {
      symbol = "O"
      setPlayer(2)
    } else {
      symbol = "X"
      setPlayer(1)
    }

    //click den sonra map edilen index ile tıklanan kutucuk aynı değil ise mevcur item dönüyor değil ise oyuncunun sembol değeri.
    setGameArray((prev) =>
      prev.map((item, index) => {
        if (index != param) {
          return item
        }
        return symbol

      }))


  }
  //Win olabilecek durumların index kontrol mekanizması. Horizontal vertical and diagonal win durumları 
  const checkWin = (currentList) => {
    if ((currentList[0] != "" && currentList[0] === currentList[1] && currentList[0] === currentList[2]) ||
      (currentList[3] != "" && currentList[3] === currentList[4] && currentList[3] === currentList[5]) ||
      (currentList[6] != "" && currentList[6] === currentList[7] && currentList[6] === currentList[8]) ||
      (currentList[0] != "" && currentList[0] === currentList[3] && currentList[0] === currentList[6]) ||
      (currentList[1] != "" && currentList[1] === currentList[4] && currentList[1] === currentList[7]) ||
      (currentList[2] != "" && currentList[2] === currentList[5] && currentList[2] === currentList[8]) ||
      (currentList[0] != "" && currentList[0] === currentList[4] && currentList[0] === currentList[8]) ||
      (currentList[2] != "" && currentList[2] === currentList[4] && currentList[2] === currentList[6])
    ) {
      return true
    } else {
      return false
    }
  }
  //kazandıran hamleden hemen sonra
  useEffect(() => {

    if (checkWin(gameArray)) {
      setWinState(true);
      console.log("kazandınız")
      return
    }
    if (player == 2 && vsAI == 1) {
      setTimeout(() => {
        let move = calculateMove()
        setGameArray((prev) =>
          prev.map((item, index) => {
            if (index != move) {
              return item
            }
            return "X"

          }))

        setPlayer(1)
      }, 500)

    }
  }, [gameArray])

  //BİLGİSAYARA KARŞI YADA GERCEK OYUNCUYA KARŞI OYNAMA SEÇENEĞİ
  const changePlayerType = () => {
    if (vsAI == 1) {
      setVsAI(0)
    } else {
      setVsAI(1)
    }
  }

  return (

    <div className="App">
      <div>
        <div className='flex space-x-64 font-bold rounded-lg'>
          <div onClick={changePlayerType} className={vsAI ? ' bg-red-300 hover:bg-red-400 active:bg-pink-300 focus:outline-none focus:ring focus:ring-red-800  p-[10px] rounded cursor-pointer ' : ' p-[10px] rounded cursor-pointer'}><span>VS AI</span></div>
          <div onClick={changePlayerType} className={!vsAI ? 'bg-red-300 hover:bg-red-400 active:bg-pink-300 focus:outline-none focus:ring focus:ring-red-800  p-[10px] rounded cursor-pointer' : ' p-[10px] rounded cursor-pointer'}>VS PLAYER</div>
        </div>

        <br />

      </div>
      <div className='font-semibold text-6xl '>XOX GAME</div>
      <div> <div className='text-3xl mb-4' id="player" >{!win ? "Player " + player + "'s Turn" : "GAME OVER"}</div>
        <button className='text-4xl' onClick={restartGame}> <VscDebugRestart /></button>
      </div>
      <div className="drop-shadow-2xl grid grid-cols-3 grid-flow-row w-auto h-96 mb-8 grid grid-rows-3 grid-cols-3 text-6xl 	">
        {
          gameArray.map((item, index) => {
            return <div onClick={event => afterClick(index)} className="box-border grid content-center " key={index}>{item}</div>
          })}
      </div>

      {win ? <div className='mt-10 text-3xl text'>PLAYER {player == 2 ? 1 : (vsAI ? 'AI' : 2)} WON THE GAME</div> : (availableSpaces().length == 0 ? <div className='mt-10 text-3xl text'>IT'S A DRAW</div>:'')}
      {
        win ?
          <Confetti
            width={width}
            height={height}
          /> : ""
      }
    </div>
  );
}



export default App;
