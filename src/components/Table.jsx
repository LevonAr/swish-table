import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FaSearch, FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';
import { VscSearchFuzzy } from "react-icons/vsc";


import './Table.css';
import Props from '../data/props.json'
import Alternates from '../data/alternates.json'

const getData = async () => {
    const data = {
        'props': Props,
        'alternates': Alternates,
    }
    return data;
};

const TableContainer = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const apiData = getData().then((res) => {
            setData(res?.props);
        });
    }, []);
    if (data === null) {
        return (<>No Data</>);
    } else {
        return (
            <Table data={data} />
        );
    }
};

const Table = (data) => {
    const { data: tableData } = data;

    const [playerFilter, setPlayerFilter] = useState('');
    const [teamFilter, setTeamFilter] = useState('');

    const [positionSort, setPositionSort] = useState('');
    const [statSort, setStatSort] = useState('');
    const [marketSort, setMarketSort] = useState('');
    const [lineSort, setLineSort] = useState('');

    const [activeButton, setActiveButton] = useState(0);
    const [page, setPage] = useState(1);

    // Filter by Player & Team
    const filteredData = tableData.filter((item) => item.playerName.toLowerCase().includes(playerFilter.toLowerCase()) && item.teamNickname.toLowerCase().includes(teamFilter.toLowerCase()));

    // Sort by Position
    const sortedPosition = positionSort !== '' ? filteredData.sort((a, b) => {
        if (positionSort === 'ASC') {
            return a.position.localeCompare(b.position);
        } else if (positionSort === 'DESC') {
            return b.position.localeCompare(a.position);
        };
    }) : null;

    // Sort by Stat
    const sortedStat = statSort !== '' ? filteredData.sort((a, b) => {
        if (statSort === 'ASC') {
            return a.statType.localeCompare(b.statType);
        } else if (statSort === 'DESC') {
            return b.statType.localeCompare(a.statType);
        };
    }) : null;

    // Sort by Market
    const sortedMarket = marketSort !== '' ? filteredData.sort((a, b) => {
        if (marketSort === 'ASC') {
            return parseFloat(a.marketSuspended) - parseFloat(b.marketSuspended);
        } else if (marketSort === 'DESC') {
            return parseFloat(b.marketSuspended) - parseFloat(a.marketSuspended);
        };
    }) : null;

    // Sort by Line
    const sortedLine = lineSort !== '' ? filteredData.sort((a, b) => {
        if (lineSort === 'ASC') {
            return parseFloat(a.line) - parseFloat(b.line);
        } else if (lineSort === 'DESC') {
            return parseFloat(b.line) - parseFloat(a.line);
        };
    }) : null;

    // Display Data Logic
    const sortedData = sortedPosition || sortedStat || sortedMarket || filteredData;
    const pageButtonsCount = Math.floor(sortedData.length / 10) + 1;
    const [start, end] = [(page - 1) * 10, page * 10 - 1]
    const paginatedData = sortedData.slice(start, end);
    const processedData = paginatedData;
    return (
        <section className="module">
            <table>
                <thead>
                    <tr className="header-table">
                        <th>
                            <Filter
                                label="PLAYER"
                                onComplete={() => setPage(1)}
                                onInputValue={setPlayerFilter}
                            />
                        </th>
                        <th>
                            <Filter
                                label="TEAM"
                                onComplete={() => setPage(1)}
                                onInputValue={setTeamFilter}
                            />
                        </th>
                        <th>
                            <Sort
                                label="POSITION"
                                onComplete={() => {
                                    setStatSort('');
                                    setMarketSort('');
                                    setLineSort('');
                                }}
                                onSelectValue={setPositionSort}
                                value={positionSort}
                            />
                        </th>
                        <th>
                            <Sort
                                label="STAT"
                                onComplete={() => {
                                    setPositionSort('');
                                    setMarketSort('');
                                    setLineSort('');
                                }}
                                onSelectValue={setStatSort}
                                value={statSort}
                            />
                        </th>
                        <th>
                            <Sort
                                label="MARKET"
                                onComplete={() => {
                                    setPositionSort('');
                                    setStatSort('');
                                    setLineSort('');
                                }}
                                onSelectValue={setMarketSort}
                                value={marketSort}
                            />
                        </th>
                        <th>
                            <Sort
                                label="LINE"
                                onComplete={() => {
                                    setPositionSort('');
                                    setStatSort('');
                                    setMarketSort('');
                                }}
                                onSelectValue={setLineSort}
                                value={lineSort}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th className="cell-header">Player</th>
                        <th className="cell-header">Team</th>
                        <th className="cell-header">Position</th>
                        <th className="cell-header">Stat</th>
                        <th className="cell-header">Market Status</th>
                        <th className="cell-header">Line</th>
                    </tr>
                </thead>
                <tbody>
                    {processedData.map((item, idx) => {
                        return (
                            <tr>
                                <td className="cell-data">{item?.playerName}</td>
                                <td className="cell-data">{item?.teamNickname}</td>
                                <td className="cell-data">{item?.position}</td>
                                <td className="cell-data">{item?.statType}</td>
                                <td className="cell-data">{item?.marketSuspended === 0 ? 'Not Suspended' : 'Suspended'}</td>
                                <td className="cell-data">{item?.line}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination
                number={pageButtonsCount}
                onSelectValue={setPage}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
            />
        </section>
    );
}

const Pagination = (props) => {
    const { number, onSelectValue, activeButton, setActiveButton } = props;
    const buttons = [];
    for (let i = 0; i < number; i++) {
        buttons.push(
            <button
                className={`pagination ${activeButton === i ? 'active' : ''}`}
                onClick={() => {
                    onSelectValue(i + 1);
                    setActiveButton(i);
                }}
            >
                {i + 1}
            </button>
        );
    };
    return (
        <section>
            {buttons}
        </section>
    );
};

const Filter = (props) => {
    const { onComplete, onInputValue, label } = props;
    return (
        <section className="search-filter">
            <div>
                <p className="small-text"><FaSearch /> {label}</p>
            </div>
            <input
                className="search-input"
                type="text"
                onChange={(e) => {
                    onInputValue(e.target.value);
                    onComplete();
                }}
            />
        </section >
    );
}

const Sort = (props) => {
    const { onComplete, onSelectValue, value, label } = props;
    const displayAsc = value !== 'ASC';
    const displayDesc = value !== 'DESC';
    return (
        <section className="sort-filter" >
            <p className="small-text">{label}</p>
            {displayAsc && <button className="sort" onClick={() => { onSelectValue('ASC'); onComplete() }}><FaSortAmountDown /></button>}
            {displayDesc && <button className="sort" onClick={() => { onSelectValue('DESC'); onComplete() }}><FaSortAmountUpAlt /></button>}
        </section>
    );
};

export default TableContainer;