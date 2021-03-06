import React, { Component } from 'react';
import classes from './Map.css';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

class Map extends Component {

  componentDidMount() {
    this.renderMap()
  };

  componentDidUpdate() {
    this.renderMap()
  }

  renderMap = () => {
      this.loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDRoF3AQcn0aoVUEHOUwoQnWlgf-m60GWs&callback=initMap")
      window.initMap = this.initMap;
  }

  

  initMap = () => {
    let coords = [];
    let zoom = '';

    if(this.props.searchedProduct.location == 'All locations') {
        zoom = 6
        coords = [45.504385, -72.564356]
    } else {
      if(this.props.searchedProduct.location == 'Montreal') {
        zoom = 11
        coords = [45.50884, -73.58781]
      } else {
        if(this.props.searchedProduct.location == 'Ottawa') {
          zoom = 11
          coords = [45.399467, -75.707121]
        } else {
          zoom = 11 
          coords = [46.827081, -71.206457]
        }
      }
    } 

    const map = new window.google.maps.Map(document.getElementById('map'),
        {
            center: {lat: coords[0], lng: coords[1]},
            zoom: zoom
        });

        let markerInfos = [...this.props.products];

        markerInfos = markerInfos.filter(item => {      
          if(this.props.searchedProduct.type == 'All types') {
                      return item.info.type !== ''
              } else {
                      return item.info.type == this.props.searchedProduct.type
                  }    
          })


        markerInfos = markerInfos.filter(item => {
          return item.info.baths > (this.props.searchedProduct.bath - 1)
      })


      markerInfos = markerInfos.filter(item => {
          return item.info.beds > (this.props.searchedProduct.bed - 1)
      })

      markerInfos = markerInfos.filter(item => {
          return item.info.price > this.props.searchedProduct.min 
      })

      markerInfos = markerInfos.filter(item => {
          return item.info.price < this.props.searchedProduct.max
      })

        // Create an InfoWindow
         let infoWindow = new window.google.maps.InfoWindow();

        //Display markers dynamically
        markerInfos.map(item => {             
            
              // Creata a Marker
              let marker = new window.google.maps.Marker({
                    position: {lat: item.lat, lng: item.lng},
                    map: map,
                    icon: "http://www.codeshare.co.uk/images/blue-pin.png"
                  })
              
              let contentString = '<a href=/details/' + item.id + ' style="text-decoration:none; color:#101D2C">' +                                       
                                       '<div style="text-align:center"> '+ item.title + ' </div>'+
                                       '<div style="text-align:center">$ ' + item.info.price.toLocaleString()+ '</div>'+                                                        
                                  '</a>'


              // Open InfowWindow on click
              marker.addListener('click', () => {
                infoWindow.setContent(contentString)

                infoWindow.open(map, marker);
                  })
          
        })

    }

    loadScript = (url) => {
        let index = window.document.getElementsByTagName("script")[0];
        let script = window.document.createElement("script");
        script.src = url
        script.async = true;
        script.defer = true;
        index.parentNode.insertBefore(script, index);
    }


  render() {
    return (
        <section>
            <div id="map" className={classes.Map}></div>
        </section>
    )
  }

};

const mapStateToProps = state => {
  return {
    products: state.products,
    searchedProduct : state.searchedProduct

  }
}


export default connect(mapStateToProps)(Map);















