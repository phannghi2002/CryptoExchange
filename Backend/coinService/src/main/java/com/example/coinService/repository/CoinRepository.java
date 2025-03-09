package com.example.coinService.repository;

import com.example.coinService.modal.Coin;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.Document;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoinRepository extends MongoRepository<Coin, String>, PagingAndSortingRepository<Coin, String> {

    @Query("{ 'market_cap_rank' : { $gte: ?0, $lte: ?1 } }")
    List<Coin> findByMarketCapRankBetween(int startRank, int endRank);

    @Query("{}")
    List<Coin> findTop10ByPriceChangePercentage24hDesc(Pageable pageable);

    @Query("{ 'price_change_percentage_24h': { $lt: 0 } }")
    List<Coin> findTop10ByPriceChangePercentage24hAsc(Pageable pageable);

    @Query("{ '$or': [ { 'id': { '$regex': ?0, '$options': 'i' } }, { 'symbol': { '$regex': ?0, '$options': 'i' } } ] }")
    Optional<List<Coin>> findCoinByIdOrSymbol(String keyword);

    @Query("{ '_id': { '$in': ?0 } }")
    List<Coin> findByCoinIdIn(List<String> coinIds);

//    @Query("{ 'symbol': { '$in': ?0, '$options': 'i' } }") // i ko phân biệt hoa thường
//    List<Coin> findBySymbolIn(List<String> symbols);


    // Case-insensitive search by symbols (using method name convention)
    List<Coin> findBySymbolInIgnoreCase(List<String> symbols);




}
