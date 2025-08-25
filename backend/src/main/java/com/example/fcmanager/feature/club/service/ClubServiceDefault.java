package com.example.fcmanager.feature.club.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.fcmanager.feature.address.domain.Address;
import com.example.fcmanager.feature.address.dto.AddressRequestDto;
import com.example.fcmanager.feature.address.mapper.AddressMapper;
import com.example.fcmanager.feature.address.repository.AddressRepository;
import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.club.dto.ClubResponseDto;
import com.example.fcmanager.feature.club.dto.CreateClubRequestDto;
import com.example.fcmanager.feature.club.dto.UpdateClubRequestDto;
import com.example.fcmanager.feature.club.mapper.ClubMapper;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.shared.exception.ClubAlreadyExistsException;
import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.shared.exception.UserNotFoundWithIdException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClubServiceDefault implements ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ClubMapper clubMapper;
    private final AddressMapper addressMapper;

    @Override
    public List<ClubResponseDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(clubMapper::toClubDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClubResponseDto getClubById(UUID id) {
        return clubRepository.findById(id)
                .map(clubMapper::toClubDto)
                .orElseThrow(() -> new ClubNotFoundException(id.toString()));
    }

    @Override
    @Transactional
    public ClubResponseDto createClub(CreateClubRequestDto createClubRequestDto) {
        if (clubRepository.existsByName(createClubRequestDto.getName())) {
            throw new ClubAlreadyExistsException(createClubRequestDto.getName());
        }

        Club club = clubMapper.createClubRequestDtoToClub(createClubRequestDto);

        User user = userRepository.findById(createClubRequestDto.getOwnerId())
                .orElseThrow(() -> new UserNotFoundWithIdException((createClubRequestDto.getOwnerId()).toString()));

        AddressRequestDto addressRequestDto = createClubRequestDto.getAddress();

        Address address = addressMapper.addressRequestDtoToAddress(addressRequestDto);
        Address savedAddress = addressRepository.save(address);

        club.setUser(user);
        club.setAddress(savedAddress);

        Club savedClub = clubRepository.save(club);
        return clubMapper.toClubDto(savedClub);
    }

    @Override
    @Transactional
    public ClubResponseDto updateClub(UUID id, UpdateClubRequestDto updateClubRequestDto) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ClubNotFoundException(id.toString()));

        if (!club.getName().equals(updateClubRequestDto.getName()) && clubRepository.existsByName(updateClubRequestDto.getName())) {
            throw new ClubAlreadyExistsException(updateClubRequestDto.getName());
        }

        club.setName(updateClubRequestDto.getName());
        club.setBadge(updateClubRequestDto.getBadge());
        club.setFoundedYear(updateClubRequestDto.getFoundedYear());
        club.setStadiumName(updateClubRequestDto.getStadiumName());
        club.setStadiumCapacity(updateClubRequestDto.getStadiumCapacity());

        if (updateClubRequestDto.getAddress() != null) {
            if (club.getAddress() != null) {
                addressMapper.updateAddressFromDto(updateClubRequestDto.getAddress(), club.getAddress());
                addressRepository.save(club.getAddress());
            } else {
                Address newAddress = addressMapper.addressRequestDtoToAddress(updateClubRequestDto.getAddress());
                Address savedAddress = addressRepository.save(newAddress);
                club.setAddress(savedAddress);
            }
        }

        Club updatedClub = clubRepository.save(club);
        return clubMapper.toClubDto(updatedClub);
    }

    @Override
    public byte[] getClubBadge(UUID id) {
        return clubRepository.findById(id)
                .map(Club::getBadge)
                .orElseThrow(() -> new ClubNotFoundException(id.toString()));
    }

    @Override
    @Transactional
    public void deleteClub(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ClubNotFoundException(id.toString()));

        clubRepository.delete(club);
    }

    @Override
    @Transactional
    public List<ClubResponseDto> getClubsByOwnerId(UUID userId) {
        return clubRepository.findByUserUserId(userId).stream()
                .map(clubMapper::toClubDto)
                .collect(Collectors.toList());
    }
}