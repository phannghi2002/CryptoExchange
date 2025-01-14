package com.example.coinService.updatePrice;

import com.example.coinService.modal.Coin;
import com.example.coinService.repository.CoinRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CoinPriceUpdater {

    private final CoinRepository coinRepository;

    public CoinPriceUpdater(CoinRepository coinRepository) {
        this.coinRepository = coinRepository;
    }

    public List<Coin> updateCoinPrices(int page, int size) {
        Random random = new Random();

        // Lấy các đồng coin theo trang hiện tại
        List<Coin> coins = coinRepository.findByMarketCapRankBetween(page * size + 1, (page + 1) * size);

        // Chọn ngẫu nhiên số lượng coin sẽ biến động (2-6 coin)
        //int coinsToUpdate = random.nextInt(5) + 2; // random từ 2 đến 6
        int coinsToUpdate = getRandomList(coins.size());

        // Chọn ngẫu nhiên các coin cần biến động
        Set<Integer> selectedIndexes = new HashSet<>();
        while (selectedIndexes.size() < coinsToUpdate) {
            selectedIndexes.add(random.nextInt(coins.size()));
        }

        // Cập nhật giá cho các coin được chọn
        for (int i = 0; i < coins.size(); i++) {
            Coin coin = coins.get(i);
            if (selectedIndexes.contains(i)) {
                // Tạo sự biến động ngẫu nhiên cho current_price và price_change_percentage_24h
                // Biến động trong khoảng -0.02% đến +0.02%
                double priceChangePercentageRandom = (random.nextDouble() - 0.5) * 0.02;

                double priceChangePercentageActually = coin.getPrice_change_percentage_24h() + priceChangePercentageRandom;

                coin.setPrice_change_percentage_24h(Double.parseDouble(String.format("%.3f", priceChangePercentageActually)));

                // Cập nhật giá current_price mới dựa trên price_change_percentage_24h
                double newPrice = coin.getCurrent_price() * (1 + priceChangePercentageRandom / 100);
                coin.setCurrent_price(Double.parseDouble(String.format("%.3f", newPrice)));
            }
        }
        return coins; // Trả về danh sách coin đã được cập nhật giá
    }

    public List<Coin> updateCoinTop50() {
        Random random = new Random();

        log.info("hinh nhu ham nay no khong chay");
        // Lấy các đồng coin theo trang hiện tại
        List<Coin> coins = coinRepository.findByMarketCapRankBetween(1,50);

        // Chọn ngẫu nhiên số lượng coin sẽ biến động (2-6 coin)
        //int coinsToUpdate = random.nextInt(2) + 30; // random từ 2 đến 6
        int coinsToUpdate = getRandomList(coins.size());


        // Chọn ngẫu nhiên các coin cần biến động
        Set<Integer> selectedIndexes = new HashSet<>();
        while (selectedIndexes.size() < coinsToUpdate) {
            selectedIndexes.add(random.nextInt(coins.size()));
        }

        // Cập nhật giá cho các coin được chọn
        for (int i = 0; i < coins.size(); i++) {
            Coin coin = coins.get(i);
            if (selectedIndexes.contains(i)) {
                // Tạo sự biến động ngẫu nhiên cho current_price và price_change_percentage_24h
                // Biến động trong khoảng -0.02% đến +0.02%
                double priceChangePercentageRandom = (random.nextDouble() - 0.5) * 0.02;

                double priceChangePercentageActually = coin.getPrice_change_percentage_24h() + priceChangePercentageRandom;

                coin.setPrice_change_percentage_24h(Double.parseDouble(String.format("%.3f", priceChangePercentageActually)));

                // Cập nhật giá current_price mới dựa trên price_change_percentage_24h
                double newPrice = coin.getCurrent_price() * (1 + priceChangePercentageRandom / 100);
                coin.setCurrent_price(Double.parseDouble(String.format("%.3f", newPrice)));
            }
        }
        return coins; // Trả về danh sách coin đã được cập nhật giá
    }

    public List<Coin> updateCoinTopGainers() {
        Random random = new Random();

        // Lấy các đồng coin theo trang hiện tại
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "price_change_percentage_24h"));
        List<Coin> coins = coinRepository.findTop10ByPriceChangePercentage24hDesc(pageable);

        // Chọn ngẫu nhiên số lượng coin sẽ biến động (2-6 coin)
      //  int coinsToUpdate = random.nextInt(5) + 2; // random từ 2 đến 6
        int coinsToUpdate = getRandomList(coins.size());


        // Chọn ngẫu nhiên các coin cần biến động
        Set<Integer> selectedIndexes = new HashSet<>();
        while (selectedIndexes.size() < coinsToUpdate) {
            selectedIndexes.add(random.nextInt(coins.size()));
        }

        // Cập nhật giá cho các coin được chọn
        for (int i = 0; i < coins.size(); i++) {
            Coin coin = coins.get(i);
            if (selectedIndexes.contains(i)) {
                // Tạo sự biến động ngẫu nhiên cho current_price và price_change_percentage_24h
                // Biến động trong khoảng -0.02% đến +0.02%
                double priceChangePercentageRandom = (random.nextDouble() - 0.5) * 0.02;

                double priceChangePercentageActually = coin.getPrice_change_percentage_24h() + priceChangePercentageRandom;

                coin.setPrice_change_percentage_24h(Double.parseDouble(String.format("%.3f", priceChangePercentageActually)));

                // Cập nhật giá current_price mới dựa trên price_change_percentage_24h
                double newPrice = coin.getCurrent_price() * (1 + priceChangePercentageRandom / 100);
                coin.setCurrent_price(Double.parseDouble(String.format("%.3f", newPrice)));
            }
        }
        return coins; // Trả về danh sách coin đã được cập nhật giá
    }

    public List<Coin> updateCoinTopLosers() {
        Random random = new Random();

        // Lấy các đồng coin theo trang hiện tại
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price_change_percentage_24h"));
        List<Coin> coins = coinRepository.findTop10ByPriceChangePercentage24hAsc(pageable);

        // Chọn ngẫu nhiên số lượng coin sẽ biến động (2-6 coin)
//        int coinsToUpdate = random.nextInt(3) + 2; // random từ 2 đến 6
        int coinsToUpdate = getRandomList(coins.size());


        // Chọn ngẫu nhiên các coin cần biến động
        Set<Integer> selectedIndexes = new HashSet<>();
        while (selectedIndexes.size() < coinsToUpdate) {
            selectedIndexes.add(random.nextInt(coins.size()));
        }

        // Cập nhật giá cho các coin được chọn
        for (int i = 0; i < coins.size(); i++) {
            Coin coin = coins.get(i);
            if (selectedIndexes.contains(i)) {
                // Tạo sự biến động ngẫu nhiên cho current_price và price_change_percentage_24h
                // Biến động trong khoảng -0.02% đến +0.02%
                double priceChangePercentageRandom = (random.nextDouble() - 0.5) * 0.02;

                double priceChangePercentageActually = coin.getPrice_change_percentage_24h() + priceChangePercentageRandom;

                coin.setPrice_change_percentage_24h(Double.parseDouble(String.format("%.3f", priceChangePercentageActually)));

                // Cập nhật giá current_price mới dựa trên price_change_percentage_24h
                double newPrice = coin.getCurrent_price() * (1 + priceChangePercentageRandom / 100);
                coin.setCurrent_price(Double.parseDouble(String.format("%.3f", newPrice)));
            }
        }
        return coins; // Trả về danh sách coin đã được cập nhật giá
    }

    public Optional<List<Coin>> updateCoinTopSearch(String searchTerm) {
        Random random = new Random();

        // Tìm danh sách coin theo keyword
        Optional<List<Coin>> coinsOptional = coinRepository.findCoinByIdOrSymbol(searchTerm);

        // Kiểm tra nếu không tìm thấy coin
        if (coinsOptional.isEmpty() || coinsOptional.get().isEmpty()) {
            return Optional.empty();
        }

        List<Coin> coins = coinsOptional.get();


        // Chọn ngẫu nhiên số lượng coin sẽ biến động (2-6 coin)
//        int coinsToUpdate = random.nextInt(3) + 2; // random từ 2 đến 6
        int coinsToUpdate = getRandomList(coins.size());


        // Chọn ngẫu nhiên các coin cần biến động
        Set<Integer> selectedIndexes = new HashSet<>();
        while (selectedIndexes.size() < coinsToUpdate) {
            selectedIndexes.add(random.nextInt(coins.size()));
        }

        // Cập nhật giá cho các coin được chọn
        for (int i = 0; i < coins.size(); i++) {
            Coin coin = coins.get(i);
            if (selectedIndexes.contains(i)) {
                // Tạo sự biến động ngẫu nhiên cho current_price và price_change_percentage_24h
                // Biến động trong khoảng -0.02% đến +0.02%
                double priceChangePercentageRandom = (random.nextDouble() - 0.5) * 0.02;

                double priceChangePercentageActually = coin.getPrice_change_percentage_24h() + priceChangePercentageRandom;

                coin.setPrice_change_percentage_24h(Double.parseDouble(String.format("%.3f", priceChangePercentageActually)));

                // Cập nhật giá current_price mới dựa trên price_change_percentage_24h
                double newPrice = coin.getCurrent_price() * (1 + priceChangePercentageRandom / 100);
                coin.setCurrent_price(Double.parseDouble(String.format("%.3f", newPrice)));
            }
        }
        return Optional.of(coins); // Trả về danh sách coin đã được cập nhật giá
    }

    public Integer getRandomList(int size) {
        // Tính giá trị tối thiểu và tối đa
        int min = (int) Math.ceil(size * 1.0 / 5); // Làm tròn lên để đảm bảo ít nhất 1 phần tử
        int max = (int) Math.floor(size * 3.0 / 4); // Làm tròn xuống để không vượt quá 3/4

        if (min > max) {
            throw new IllegalArgumentException("Kích thước không hợp lệ để random (min > max)");
        }

        // Random giá trị từ min đến max (cả 2 đầu)
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

}

