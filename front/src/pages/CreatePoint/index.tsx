import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import './styles.css';
import '../../services/api';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

interface Item {
    id: number;
    image_url: string;
    title: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {

    const [items, setItems] = useState<Array<Item>>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>();
    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedItems, setSelectItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            setSelectedPosition([latitude, longitude]);
        });
    }, [])

    useEffect(() => {
        api.get('items').then((response) => {
            setItems(response.data);
        })
    }, [])

    useEffect(() => {
        axios
            .get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
            .then((response) => {
                const ufs = response.data.map(uf => uf.sigla);
                setUfs(ufs);
            })            
    }, [])

    useEffect(() => {
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then((response) => {
                const cities = response.data.map(city => city.nome);
                setCities(cities);
            })            
    }, [selectedUf])

    function handleSelectUfChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCityChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.indexOf(id);

        if (alreadySelected > -1) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectItems(filteredItems);
        } else {
            setSelectItems([...selectedItems, id])
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const uf = selectedUf;
        const city = selectedCity;


        const data = new FormData();

        data.append('name', name)
        data.append('whatsapp', whatsapp)
        data.append('email', email)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('uf', uf)
        data.append('city', city)
        data.append('items', items.join(','))
        
        if(selectedFile)
        data.append('image', selectedFile)

        await api.post('points', data);


        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />

                        <Marker position={selectedPosition}>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUfChange}>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map((uf) => {
                                        return <option key={uf} value={uf}>{uf}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCityChange}>
                                <option value="0">Selecione uma cidade</option>
                                {
                                    cities?.map((city) => {
                                        return <option key={city} value={city}>{city}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítems de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map((item) => {
                                return (
                                    <li key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    >
                                        <img src={item.image_url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;