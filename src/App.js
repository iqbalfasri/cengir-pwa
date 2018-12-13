import React, { Component } from "react";
import "./App.css";
import Select from "react-select";

import { toRupiah } from "./lib/conversi";

import axios from "axios";

class App extends Component {
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

  actionCheck(e) {
    // e.preventDefault();
    this.setState(
      {
        loadingResult: true
      },
      () => window.scrollTo(0, document.body.offsetHeight)
    );
    let dataPost = {
      origin: this.state.kotaAsal,
      destination: this.state.kotaTujuan,
      weight: this.state.berat,
      courier: "jne"
    };

    axios({
      method: "post",
      url:
        "https://cors-anywhere.herokuapp.com/https://api.rajaongkir.com/starter/cost",
      data: dataPost,
      headers: {
        key: "cbaf4caf1fb98d2c2523ff039cf3bb11"
      }
    })
      .then(res => {
        let { results } = res.data.rajaongkir;
        results.map(c => {
          return this.setState(
            {
              result: c,
              loadingResult: false
            },
            () => window.scrollTo(0, document.body.offsetHeight + 1200)
          );
        });
      })
      .catch(error => console.log(error));
  }

  handleButton() {
    let { kotaAsal, kotaTujuan, berat } = this.state;
    if (kotaAsal.length !== 0 && kotaTujuan !== 0 && berat !== "") {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="container">
        <div className="header-text d-flex flex-column align-items-center justify-content-center">
          <img alt="Icon" src={require("./assets/images/icon.png")} />
          <div className="d-flex flex-row">
            <h1 style={{ textAlign: "center", fontWeight: "700" }}>
              Cek Ongkir
            </h1>
            {/* <small className="text-muted" style={{ margin: "25px 0 0 5px" }}>
              Ver. PWA
            </small> */}
          </div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.actionCheck();
          }}
        >
          <div className="row">
            <div
              className="col-md-6 col-sm-6 col-xs-6"
              style={{ margin: "15px 0 0" }}
            >
              <Select
                isLoading={this.state.isLoading}
                placeholder="Kota asal"
                onChange={e => this.setState({ kotaAsal: e.value.toString() })}
                options={this.state.prv}
              />
            </div>
            <div
              className="col-md-6 col-sm-6 col-xs-6"
              style={{ margin: "15px 0 0" }}
            >
              <Select
                isLoading={this.state.isLoading}
                placeholder="Kota tujuan"
                onChange={e =>
                  this.setState({ kotaTujuan: e.value.toString() })
                }
                options={this.state.prv}
              />
            </div>
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="beratBarang">Berat Barang</label>
            <input
              type="text"
              className="form-control c-input"
              id="beratBarang"
              aria-describedby="beratBarang"
              placeholder="Masukan berat barang"
              onChange={e => this.setState({ berat: parseInt(e.target.value) })}
            />
          </div>
          <button
            disabled={this.handleButton()}
            className={`btn btn-warning btn-block`}
            onClick={() => {
              this.actionCheck();
            }}
          >
            Cek Sekarang
          </button>
        </form>
        <small className="text-muted" style={{ margin: "15px 0 0" }}>
          *Harga yang keluar berdasarkan harga dari JNE
        </small>
        {this.state.loadingResult ? (
          <div className="text-center">
            <div className="lds-ellipsis" style={{ margin: "50px 0 -20px" }}>
              <div />
              <div />
              <div />
              <div />
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#393e46",
                fontWeight: "500",
                opacity: 0.5
              }}
            >
              Loading...
            </p>
          </div>
        ) : this.state.result === null ? (
          <div style={{ visibility: "visible" }} />
        ) : (
          <div className="result">
            <h1 style={{ fontWeight: "700", marginBottom: 10 }}>Result</h1>
            <div className="row">
              {this.state.result.costs.map((costs, i) => (
                <div
                  key={i}
                  className={
                    this.state.result.costs.length === 2
                      ? "col-md-6"
                      : "col-md-4"
                  }
                >
                  <div className="result-content text-left">
                    <h2>{costs.service}</h2>
                    {costs.cost.map((value, i) => {
                      return (
                        <div key={i}>
                          <h4>Rp {toRupiah(value.value)}</h4>
                          <p style={{ opacity: 0.5 }}>
                            Estimasi waktu {value.etd} hari
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
