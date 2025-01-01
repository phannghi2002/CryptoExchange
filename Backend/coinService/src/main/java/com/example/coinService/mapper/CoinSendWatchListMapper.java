package com.example.coinService.mapper;

import com.example.coinService.dto.response.CoinSendWatchListResponse;
import com.example.coinService.modal.Coin;
import org.mapstruct.Mapper;

import java.util.List;


@Mapper(componentModel = "spring")
public interface CoinSendWatchListMapper {

    CoinSendWatchListResponse toCoinSendWatchList(Coin coin);

    List<CoinSendWatchListResponse> toCoinSendWatchListList(List<Coin> coins);
}
