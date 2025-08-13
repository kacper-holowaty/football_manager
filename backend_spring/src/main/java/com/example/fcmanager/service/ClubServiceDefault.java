package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.fcmanager.domain.Address;
import com.example.fcmanager.domain.Club;
import com.example.fcmanager.domain.User;
import com.example.fcmanager.dto.AddressRequestDto;
import com.example.fcmanager.dto.UpdateClubRequestDto;
import com.example.fcmanager.exception.ClubAlreadyExistsException;
import com.example.fcmanager.mappers.AddressMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.example.fcmanager.dto.ClubResponseDto;
import com.example.fcmanager.dto.CreateClubRequestDto;
import com.example.fcmanager.mappers.ClubMapper;
import com.example.fcmanager.repository.AddressRepository;
import com.example.fcmanager.repository.ClubRepository;
import com.example.fcmanager.repository.UserRepository;

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
                .orElseThrow(() -> new EntityNotFoundException("Club not found with id: " + id));
    }

    @Override
    @Transactional
    public ClubResponseDto createClub(CreateClubRequestDto createClubRequestDto) {
        if (clubRepository.existsByName(createClubRequestDto.getName())) {
            throw new ClubAlreadyExistsException(createClubRequestDto.getName());
        }

        Club club = clubMapper.createClubRequestDtoToClub(createClubRequestDto);

        User user = userRepository.findById(createClubRequestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + createClubRequestDto.getUserId()));

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
                .orElseThrow(() -> new EntityNotFoundException("Club not found with id: " + id));

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
    @Transactional
    public void deleteClub(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Club not found with id: " + id));

        clubRepository.delete(club);
    }

    @Override
    public List<ClubResponseDto> getClubsByUserId(UUID userId) {
        return clubRepository.findByUserId(userId).stream()
                .map(clubMapper::toClubDto)
                .collect(Collectors.toList());
    }
}