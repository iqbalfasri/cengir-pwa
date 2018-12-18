import React, { Component, createContext } from "react";
import axios from "axios";

const Context = createContext();

class Provider extends Component {
  constructor() {
    super();

    this.state = {
      province: [],
      prv: [],
      selectedProv: "",
      isLoading: false,
      kotaAsal: "",
      kotaTujuan: "",
      berat: "",
      result: null,
      disabled: true,
      loadingResult: false
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://api.rajaongkir.com/starter/city",
        {
          headers: {
            key: "cbaf4caf1fb98d2c2523ff039cf3bb11"
          }
        }
      )
      .then(data => {
        let { results } = data.data.rajaongkir;
        let prv = [];
        results.forEach(res => {
          prv.push({
            value: res.city_id,
            label: res.city_name
          });
        });

        this.setState({
          prv,
          isLoading: false
        });
      });
  }

  checkOngkir = data => {
    this.setState({ loadingResult: true }, () =>
      window.scrollTo(0, document.body.offsetHeight)
    );

    axios({
      method: "post",
      url:
        "https://cors-anywhere.herokuapp.com/https://api.rajaongkir.com/starter/cost",
      data: data,
      headers: {
        key: "cbaf4caf1fb98d2c2523ff039cf3bb11"
      }
    })
      .then(res => {
        let { results } = res.data.rajaongkir;
        results.map(c => {
          return this.setState({ result: c, loadingResult: false }, () =>
            window.scrollTo(0, document.body.offsetHeight + 1200)
          );
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: {
            checkOngkir: this.checkOngkir
          }
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;
export { Provider, Consumer };
