package com.ssafy.api.controller;

import com.ssafy.api.request.TarotCardRequest;
import com.ssafy.api.request.UpdateImageRequest;
import com.ssafy.db.entity.TarotCard;
import com.ssafy.api.service.TarotCardService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Api(value = "타로카드 API", tags = {"TarotCard"})
@RestController
@RequestMapping("/api/v1/tarot-cards")
public class TarotCardController {

    @Autowired
    private TarotCardService tarotCardService;

    // **1. 생성 - 세트 번호, 이름 번호, 이미지**
    @PostMapping
    public ResponseEntity<TarotCard> createTarotCard(@RequestBody TarotCardRequest request) {
        TarotCard createdCard = tarotCardService.createTarotCard(request.getSetNumber(), request.getCardNumber(), request.getCardImage());
        return ResponseEntity.ok(createdCard);
    }

    // **2. 조회 - 세트 번호 기반 7개 조회**
    @GetMapping("/set/{setNumber}")
    public ResponseEntity<List<TarotCard>> getCardsBySetNumber(@PathVariable Integer setNumber) {
        List<TarotCard> cards = tarotCardService.getCardsBySetNumber(setNumber);
        return ResponseEntity.ok(cards);
    }

    // **3. 조회 - 카드 하나 조회 (세트 번호와 카드 번호로)**
    @GetMapping("/set/{setNumber}/card/{cardNumber}")
    public ResponseEntity<TarotCard> getTarotCardBySetAndNumber(@PathVariable Integer setNumber, @PathVariable Integer cardNumber) {
        Optional<TarotCard> optionalTarotCard = tarotCardService.getTarotCardBySetAndNumber(setNumber, cardNumber);
        if (optionalTarotCard.isPresent()) {
            return ResponseEntity.ok(optionalTarotCard.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // **4. 수정 - 이미지**
    @PutMapping("/set/{setNumber}/card/{cardNumber}")
    public ResponseEntity<TarotCard> updateTarotCardImage(@PathVariable Integer setNumber,
                                                          @PathVariable Integer cardNumber,
                                                          @RequestBody UpdateImageRequest request) {
        TarotCard updatedCard = tarotCardService.updateTarotCardImage(setNumber, cardNumber, request.getNewImage());
        return ResponseEntity.ok(updatedCard);
    }

    // **5. 삭제 - 하나씩 삭제**
    @DeleteMapping("/set/{setNumber}/card/{cardNumber}")
    public ResponseEntity<Void> deleteTarotCard(@PathVariable Integer setNumber, @PathVariable Integer cardNumber) {
        tarotCardService.deleteTarotCard(setNumber, cardNumber);
        return ResponseEntity.noContent().build();
    }

    // **6. 삭제 - 세트 삭제**
    @DeleteMapping("/set/{setNumber}")
    public ResponseEntity<Void> deleteCardsBySet(@PathVariable Integer setNumber) {
        tarotCardService.deleteCardsBySet(setNumber);
        return ResponseEntity.noContent().build();
    }
}