import { Component } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 310,
        newItemChar: false,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset).
            then(this.onCharListLoaded);
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) ended = true;
        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            offset: offset + 9,
            newItemChar: false,
            charEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({ newItemChar: true })
    }

    renderItems = (charList) => {
        const items = charList.map(item => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li onClick={() => this.props.onSetIdChar(item.id)}
                    key={item.id} className="char__item">
                    <img style={imgStyle} src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, offset, newItemChar, ended } = this.state;
        const items = this.renderItems(charList);
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list" >
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long"
                    onClick={() => this.onRequest(offset)}
                    disabled={newItemChar}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;

