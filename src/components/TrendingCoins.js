import React, { Component } from 'react';
import { store } from 'react-notifications-component';
import BasicTable  from './BasicTable';
import SortingTable  from './SortingTable';
import './trendingcoin.css'

import axios from 'axios';

class TrendingCoins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            coinTokenData: [],
            oldCoinTokenData: [],
            difference: []
        };
        let renderedTrending = []

        let interval = ''

        this.fetchTrendingCoins = this.fetchTrendingCoins.bind(this);
    }

    //returns true if arrays and positions are identical
    //e.g. a=[1,2,3] b=[1,3,2] would be false 
    arraysAreIdentical(arr1, arr2){
        if (arr1.length !== arr2.length) return false;
        for (var i = 0, len = arr1.length; i < len; i++){
            if (arr1[i] !== arr2[i]){
                return false;
            }
        }
        return true; 
    }

    //returns true if arrays contain the same elements
    //e.g a = [1,2,3,4,5] and b = [2,3,1,5,4] would be true

    arrayCompare(_arr1, _arr2) {
        if (
          !Array.isArray(_arr1)
          || !Array.isArray(_arr2)
          || _arr1.length !== _arr2.length
          ) {
            return false;
          }
        
        // .concat() to not mutate arguments
        const arr1 = _arr1.concat().sort();
        const arr2 = _arr2.concat().sort();
        
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
             }
        }
        
        return true;
    }

    //additionally returns an array of differences between the two arrays
    // returns true if they are the same

    doArraysContainSameStrings(_arr1, _arr2) {
        let differences = [] 
        if (
          !Array.isArray(_arr1)
          || !Array.isArray(_arr2)
          || _arr1.length !== _arr2.length
          ) {
            return false;
          }
        
        // .concat() to not mutate arguments
        const arr1 = _arr1.concat().sort();
        const arr2 = _arr2.concat().sort();
        
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i] && !arr1.includes(arr2[i])) {
                differences.push(arr2[i])
             }
        }
        
        if(differences.length > 0) {
            return [false, differences]
        }
        else return true
    }

    async fetchTrendingCoins() {
        //console.log('This works!');
        await axios.get(`https://api.coingecko.com/api/v3/search/trending`)
            .then(res => {
                this.setState({
                    isLoaded: false,
                    coinTokenData: res.data.coins
                })
            }
                )
        let newCoinTokenData = []
        this.state.coinTokenData.forEach(token => {
            newCoinTokenData.push(token.item.symbol)
        })
        // console.log('This is the oldCoinTokenData')
        // console.log(this.state.oldCoinTokenData)
        // console.log('This is what it will be set to:')
        // console.log(newCoinTokenData)
        // if (!this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData)[0]) 
        // if (this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData) === true || this.state.difference.length === 0) {
        console.log(this.state.difference)
        if (this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData) === true || this.state.oldCoinTokenData.length === 0) {
            console.log("No changes!")
            console.log(this.state.oldCoinTokenData)
            console.log(newCoinTokenData)
        }
        else {
            console.log('Not the same!')
            await this.setState({
                difference: this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData)[1]
            })
            console.log(this.state.difference)
            store.addNotification({
                title: "New Coin Trending",
                message: this.state.difference[0],
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 6000000,
                  onScreen: true
                }
              });
        }
        await this.setState({
            coinTokenData: newCoinTokenData,
            oldCoinTokenData: newCoinTokenData,
            isLoaded: true
        })
        //console.log(this.state.coinTokenData)
    }

    /* CODE B4 3.28.21 
        async fetchTrendingCoins() {
        //console.log('This works!');
        await axios.get(`https://api.coingecko.com/api/v3/search/trending`)
            .then(res => {
                this.setState({
                    isLoaded: false,
                    coinTokenData: res.data.coins
                })
            }
                )
        let newCoinTokenData = []
        this.state.coinTokenData.forEach(token => {
            newCoinTokenData.push(token.item.symbol)
        })
        // console.log('This is the oldCoinTokenData')
        // console.log(this.state.oldCoinTokenData)
        // console.log('This is what it will be set to:')
        // console.log(newCoinTokenData)
        // if (!this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData)[0]) 
        if (this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData)[0]) {
            console.log("No changes!")
        }
        else {
            console.log('Not the same!')
            await this.setState({
                difference: this.doArraysContainSameStrings(this.state.oldCoinTokenData, newCoinTokenData)[1]
            })
            console.log(this.state.difference)
            store.addNotification({
                title: "New Coin Trending",
                message: "A new coin is now trending",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 300000,
                  onScreen: true
                }
              });
        }
        await this.setState({
            coinTokenData: newCoinTokenData,
            oldCoinTokenData: newCoinTokenData,
            isLoaded: true
        })
        //console.log(this.state.coinTokenData)
    }

    */ 
    renderTrendingCoins() {
        // console.log(this.state.coinTokenData)
        if(this.state.isLoaded) {
        return (
            this.state.coinTokenData.map(token => {
                if(this.state.difference.includes(token)) {
                    return (
                        <p className="recentlyTrendingToken">
                            {token}
                        </p>
                    )
                }
                else {
                return (
                    <p>
                        {token}
                    </p>
                );
                }
        }))
    }  else {
            return (
                <p></p>
            )
        }
    }


   async componentDidMount() {
        await this.fetchTrendingCoins()
        this.interval = setInterval(this.fetchTrendingCoins, 20000)
    } 

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // sample() {
    //     let a = ['MARK','TIDAL','SPI','OMI','ERN','CAKE','OGN']
    //     let b = ['cake','ctsi','matic','dec','ada','sxp','unistake']
    //     let c = ['MARK','SPI','OMI','ERN','MAGIC','OGN','TIDAL']
    //     let d = ['MARK', 'TIDAL', 'ERN', 'OMI', 'SPI', 'OGN', 'RBC']
    //     let e = ['MARK', 'TIDAL', 'ERN', 'OMI', 'SPI', 'OGN', 'CRO']
    //     console.log(this.doArraysContainSameStrings(d,e))
    //     return(this.doArraysContainSameStrings(d,e) === true)
    // }


    render() {
      //console.log(this.sample())
      return (
          <div>
            {this.renderTrendingCoins()}
          </div>
      );
    }
  }

export default TrendingCoins;
